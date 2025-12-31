import { useState } from 'react'
import { sendMessage } from '../../services/messageService'
import './MessageForm.css'

const MessageForm = () => {
    const [formData, setFormData] = useState({
        message: ''
    })
    const [status, setStatus] = useState('idle') // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.message.trim()) {
            setErrorMessage('Пожалуйста, заполните поле сообщения')
            setStatus('error')
            return
        }

        setStatus('sending')
        setErrorMessage('')

        try {
            await sendMessage({ ...formData, name: 'Аноним' }) // Send default name
            setStatus('success')
            setFormData({ message: '' })

            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus('idle')
            }, 5000)
        } catch (error) {
            setStatus('error')
            setErrorMessage(error.message || 'Ошибка при отправке сообщения')
        }
    }

    return (
        <div className="message-form-container slide-up">
            <form className="message-form glass" onSubmit={handleSubmit}>
                <h3 className="form-title">Отправить сообщение</h3>
                <p className="form-subtitle">Оставь свои слова...</p>

                <div className="form-group">
                    <label htmlFor="message" className="form-label">Твое сообщение</label>
                    <textarea
                        id="message"
                        name="message"
                        className="textarea"
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={2000}
                        disabled={status === 'sending'}
                        placeholder="Напиши что думаешь..."
                        rows={6}
                    />
                    <div className="char-count">
                        {formData.message.length} / 2000
                    </div>
                </div>

                {status === 'error' && (
                    <div className="form-message error">
                        {errorMessage}
                    </div>
                )}

                {status === 'success' && (
                    <div className="form-message success">
                        ✓ Сообщение отправлено! Спасибо за твои слова.
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'sending'}
                >
                    {status === 'sending' ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        </div>
    )
}

export default MessageForm
