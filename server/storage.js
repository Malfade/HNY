import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_FILE = path.join(__dirname, 'data', 'messages.json')

/**
 * Ensure data directory and file exist
 */
const ensureDataFile = async () => {
    try {
        const dataDir = path.dirname(DATA_FILE)
        await fs.mkdir(dataDir, { recursive: true })

        try {
            await fs.access(DATA_FILE)
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify([]))
        }
    } catch (error) {
        console.error('Error ensuring data file:', error)
    }
}

/**
 * Read all messages from storage
 */
export const readMessages = async () => {
    await ensureDataFile()
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading messages:', error)
        return []
    }
}

/**
 * Write messages to storage
 */
export const writeMessages = async (messages) => {
    await ensureDataFile()
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2))
    } catch (error) {
        console.error('Error writing messages:', error)
        throw error
    }
}

/**
 * Add a new message
 */
export const addMessage = async (messageData) => {
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

/**
 * Delete a message by ID
 */
export const deleteMessageById = async (messageId) => {
    const messages = await readMessages()
    const filteredMessages = messages.filter(msg => msg.id !== messageId)

    if (filteredMessages.length === messages.length) {
        throw new Error('Message not found')
    }

    await writeMessages(filteredMessages)
    return { success: true }
}
