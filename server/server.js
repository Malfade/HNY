import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { addMessage, readMessages, deleteMessageById } from './storage.js'
import { checkAuth } from './middleware/auth.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Rate limiting to prevent spam
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: 'Слишком много запросов, попробуйте позже' }
})

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Слишком много запросов' }
})

// Routes

/**
 * POST /api/messages - Submit a new message
 */
app.post('/api/messages', messageLimiter, async (req, res) => {
    try {
        const { name, message } = req.body

        // Validation
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

        res.status(201).json({
            success: true,
            message: 'Сообщение отправлено',
            data: newMessage
        })
    } catch (error) {
        console.error('Error creating message:', error)
        res.status(500).json({ message: 'Ошибка сервера' })
    }
})

/**
 * GET /api/messages - Get all messages (admin only)
 */
app.get('/api/messages', checkAuth, adminLimiter, async (req, res) => {
    try {
        const messages = await readMessages()
        res.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        res.status(500).json({ message: 'Ошибка сервера' })
    }
})

/**
 * DELETE /api/messages/:id - Delete a message (admin only)
 */
app.delete('/api/messages/:id', checkAuth, adminLimiter, async (req, res) => {
    try {
        const { id } = req.params
        await deleteMessageById(id)
        res.json({ success: true, message: 'Сообщение удалено' })
    } catch (error) {
        console.error('Error deleting message:', error)
        if (error.message === 'Message not found') {
            return res.status(404).json({ message: 'Сообщение не найдено' })
        }
        res.status(500).json({ message: 'Ошибка сервера' })
    }
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default app
