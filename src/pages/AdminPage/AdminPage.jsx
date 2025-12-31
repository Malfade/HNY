import { useState, useEffect } from 'react'
import { getMessages, deleteMessage } from '../../services/messageService'
import './AdminPage.css'

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Simple admin password - change this for production
    const ADMIN_PASSWORD = 'newyear2025'

    useEffect(() => {
        if (isAuthenticated) {
            loadMessages()
        }
    }, [isAuthenticated])

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            setError('')
        } else {
            setError('Неверный пароль')
        }
    }

    const loadMessages = async () => {
        setLoading(true)
        try {
            const data = await getMessages(ADMIN_PASSWORD)
            setMessages(data)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (messageId) => {
        if (!window.confirm('Удалить это сообщение?')) return

        try {
            await deleteMessage(messageId, ADMIN_PASSWORD)
            setMessages(messages.filter(msg => msg.id !== messageId))
        } catch (err) {
            setError(err.message)
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isAuthenticated) {
        return (
            <div className="admin-page">
                <div className="admin-login">
                    <form className="login-form glass" onSubmit={handleLogin}>
                        <h2>Админ-панель</h2>
                        <p className="text-muted">Введите пароль для доступа</p>

                        <input
                            type="password"
                            className="input"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary">
                            Войти
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Полученные сообщения</h1>
                    <button onClick={loadMessages} className="btn btn-primary" disabled={loading}>
                        {loading ? 'Загрузка...' : 'Обновить'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {messages.length === 0 && !loading && (
                    <div className="empty-state glass">
                        <p>Пока нет сообщений</p>
                    </div>
                )}

                <div className="messages-grid">
                    {messages.map((message) => (
                        <div key={message.id} className="message-card glass slide-up">
                            <div className="message-header">
                                <div>
                                    <p className="message-date">{formatDate(message.timestamp)}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(message.id)}
                                    className="delete-btn"
                                    title="Удалить"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                            </div>
                            <div className="message-text">
                                {message.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminPage
