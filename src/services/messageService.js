const API_URL = '/api/messages';

/**
 * Sanitize user input to prevent XSS attacks
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Send a message to the backend API
 * @param {Object} messageData - { name: string, message: string }
 * @returns {Promise<Object>} Response from server
 */
export const sendMessage = async (messageData) => {
    try {
        // Validate input
        if (!messageData.name || !messageData.message) {
            throw new Error('Имя и сообщение обязательны');
        }

        if (messageData.name.length > 100) {
            throw new Error('Имя слишком длинное (макс. 100 символов)');
        }

        if (messageData.message.length > 2000) {
            throw new Error('Сообщение слишком длинное (макс. 2000 символов)');
        }

        // Sanitize input
        const sanitizedData = {
            name: sanitizeInput(messageData.name.trim()),
            message: sanitizeInput(messageData.message.trim())
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка при отправке сообщения');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Get all messages from the backend API (admin only)
 * @param {string} password - Admin password
 * @returns {Promise<Array>} Array of messages
 */
export const getMessages = async (password) => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${password}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Неверный пароль');
            }
            throw new Error('Ошибка при получении сообщений');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

/**
 * Delete a message by ID (admin only)
 * @param {string} messageId - ID of message to delete
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Response from server
 */
export const deleteMessage = async (messageId, password) => {
    try {
        const response = await fetch(`${API_URL}/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${password}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Неверный пароль');
            }
            throw new Error('Ошибка при удалении сообщения');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};
