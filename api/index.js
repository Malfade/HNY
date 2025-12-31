// Vercel Serverless Function для API
import { readMessages, addMessage, deleteMessageById } from '../server/storage.js'

// Simple admin password
const ADMIN_PASSWORD = 'newyear2025'

// Rate limiting store (в production использовать Redis)
const rateLimitStore = new Map()

const checkRateLimit = (ip, maxRequests = 5, windowMs = 15 * 60 * 1000) => {
    const now = Date.now()
    const userRequests = rateLimitStore.get(ip) || []

    // Очистить старые запросы
    const recentRequests = userRequests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
        return false
    }

    recentRequests.push(now)
    rateLimitStore.set(ip, recentRequests)
    return true
}

const checkAuth = (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return false

    const token = authHeader.replace('Bearer ', '')
    return token === ADMIN_PASSWORD
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    )

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    const { method, url } = req
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    try {
        // POST /api/messages - Submit message
        if (method === 'POST' && url === '/api/messages') {
            if (!checkRateLimit(ip, 5)) {
                return res.status(429).json({ message: 'Слишком много запросов, попробуйте позже' })
            }

            const { name, message } = req.body

            if (!name || !message) {
                return res.status(400).json({ message: 'Имя и сообщение обязательны' })
            }

            if (name.length > 100) {
                return res.status(400).json({ message: 'Имя слишком длинное' })
            }

            if (message.length > 2000) {
                return res.status(400).json({ message: 'Сообщение слишком длинное' })
            }

            const newMessage = await addMessage({ name, message })
            return res.status(201).json({
                success: true,
                message: 'Сообщение отправлено',
                data: newMessage
            })
        }

        // GET /api/messages - Get all messages (admin only)
        if (method === 'GET' && url === '/api/messages') {
            if (!checkAuth(req)) {
                return res.status(401).json({ message: 'Authorization required' })
            }

            if (!checkRateLimit(ip, 100)) {
                return res.status(429).json({ message: 'Слишком много запросов' })
            }

            const messages = await readMessages()
            return res.status(200).json(messages)
        }

        // DELETE /api/messages/:id - Delete message (admin only)
        if (method === 'DELETE' && url.startsWith('/api/messages/')) {
            if (!checkAuth(req)) {
                return res.status(401).json({ message: 'Authorization required' })
            }

            if (!checkRateLimit(ip, 100)) {
                return res.status(429).json({ message: 'Слишком много запросов' })
            }

            const id = url.split('/').pop()
            await deleteMessageById(id)
            return res.status(200).json({ success: true, message: 'Сообщение удалено' })
        }

        // Health check
        if (method === 'GET' && url === '/api/health') {
            return res.status(200).json({ status: 'ok' })
        }

        return res.status(404).json({ message: 'Not found' })
    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({ message: 'Ошибка сервера', error: error.message })
    }
}
