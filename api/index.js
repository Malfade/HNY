// Vercel Serverless Function для всех API endpoints
import fs from 'fs/promises'
import path from 'path'

// Storage functions встроенные (без импорта из server/storage.js)
const DATA_DIR = '/tmp'
const DATA_FILE = path.join(DATA_DIR, 'messages.json')

const ensureDataFile = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true })
        try {
            await fs.access(DATA_FILE)
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify([]))
        }
    } catch (error) {
        console.error('Error ensuring data file:', error)
    }
}

const readMessages = async () => {
    await ensureDataFile()
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const writeMessages = async (messages) => {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2))
}

const addMessage = async (messageData) => {
    const messages = await readMessages()
    const newMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: messageData.name,
        message: messageData.message,
        timestamp: Date.now()
    }
    messages.push(newMessage)
    await writeMessages(messages)
    return newMessage
}

const deleteMessageById = async (messageId) => {
    const messages = await readMessages()
    const filteredMessages = messages.filter(msg => msg.id !== messageId)
    if (filteredMessages.length === messages.length) {
        throw new Error('Message not found')
    }
    await writeMessages(filteredMessages)
    return { success: true }
}

// Simple admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'newyear2025'

// Rate limiting store
const rateLimitStore = new Map()

const checkRateLimit = (ip, maxRequests = 5, windowMs = 15 * 60 * 1000) => {
    const now = Date.now()
    const userRequests = rateLimitStore.get(ip) || []
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
        return res.status(200).end()
    }

    const { method } = req
    const url = req.url || ''
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    console.log(`API Request: ${method} ${url}`)

    try {
        // POST /api/messages - Submit message
        if (method === 'POST' && url.includes('/messages')) {
            if (!checkRateLimit(ip, 10)) {
                return res.status(429).json({ message: 'Слишком много запросов' })
            }

            const { name, message } = req.body

            if (!name || !message) {
                return res.status(400).json({ message: 'Имя и сообщение обязательны' })
            }

            if (name.length > 100 || message.length > 2000) {
                return res.status(400).json({ message: 'Слишком длинное имя или сообщение' })
            }

            const newMessage = await addMessage({ name, message })
            return res.status(201).json({
                success: true,
                message: 'Сообщение отправлено',
                data: newMessage
            })
        }

        // GET /api/messages - Get all messages (admin only)
        if (method === 'GET' && url.includes('/messages')) {
            if (!checkAuth(req)) {
                return res.status(401).json({ message: 'Неверный пароль' })
            }

            const messages = await readMessages()
            return res.status(200).json(messages)
        }

        // DELETE /api/messages/:id
        if (method === 'DELETE' && url.includes('/messages/')) {
            if (!checkAuth(req)) {
                return res.status(401).json({ message: 'Неверный пароль' })
            }

            const parts = url.split('/')
            const id = parts[parts.length - 1]
            await deleteMessageById(id)
            return res.status(200).json({ success: true, message: 'Удалено' })
        }

        // Health check
        if (method === 'GET' && url.includes('/health')) {
            return res.status(200).json({ status: 'ok', timestamp: Date.now() })
        }

        console.log('Route not found:', method, url)
        return res.status(404).json({ message: 'Endpoint не найден', method, url })

    } catch (error) {
        console.error('API Error:', error)
        return res.status(500).json({
            message: 'Ошибка сервера',
            error: error.message
        })
    }
}
