import { useState } from 'react'
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer'
import LyricsScroller from '../../components/LyricsScroller/LyricsScroller'
import PhotoDisplay from '../../components/PhotoDisplay/PhotoDisplay'
import MessageForm from '../../components/MessageForm/MessageForm'
import './MainPage.css'

const MainPage = () => {
    const [currentTime, setCurrentTime] = useState(0)

    const handleTimeUpdate = (time) => {
        setCurrentTime(time)
    }

    return (
        <div className="main-page">
            <section className="hero-section fade-in">
                <div className="container">
                    <h1 className="hero-title">С Новым Годом</h1>
                    <div className="hero-subtitle">Послание с любовью</div>
                </div>
            </section>

            <section className="message-section">
                <div className="container">
                    <div className="message-content glass slide-up">
                        <p>Привет, да это снова я. Знаю, что ты устала от моей приставучести, но к сожалению, я по другому не умею.</p>

                        <p>Ты даже не представляешь как много поменялось, с того момента. Как внутри меня, так и вокруг.</p>

                        <p>Этот год был необычным. Пожалуй, он был по настоящему хорош и печален одновременно. Я должен признаться, что во многом он был хорош благодаря тебе, пожалуй, я должен сказать тебе спасибо.</p>

                        <p><strong>Спасибо</strong>, что оставалась и терпела меня. <strong>Спасибо</strong>, что проводила со мной время. <strong>Спасибо</strong>, что позволила быть собой.</p>

                        <p>Мне все еще сложно дается понять, что произошло между нами. Прошло уже почти два месяца. Пожалуй да, я скучаю по тебе и тому как мы проводили время вместе.</p>

                        <p>Совсем скоро новый год, я надеюсь, что ты проведешь следующий год счастливо.</p>

                        <p className="special-message">Ну и под конец, я хочу сказать тебе:</p>

                        <p>Моя дорогая, я знаю, что ты устала, устала от всех тех, кто ломал и портил твое сердце, душу и разум. Возможно ты видишь ошибки о которых ты сожелеешь. Выбор, которых ты бы хотела изменить. Но помни, что бы ты не сделала, ты заслуживаешь лучшего.</p>

                        <p><strong>Никогда не опускай голову, иди гордо и двигайся дальше.</strong></p>

                        <p>Пусть новый год не станет для тебя новым испытанием, а станет новой возможностью, прожить его спокойно и счастливо. И знай, что тебя любят больше, чем ты думаешь.</p>

                        <p>К сожалению, я не думаю, что смогу быть рядом с тобой и поддерживать тебя. Но в глубине души, я надеюсь, что ты тоже скучаешь. Я искренне сожалею обо всех сказанных мной вещах, особенно когда я пытался все исправить. Все это, было не правильно, ведь, мне нужно было просто включить голову и подумать над тем, что я говорю.</p>

                        <p className="apology">Прости меня, за все мои ошибки. Все мои неудачи. И за то, что не оправдал твои ожидания.</p>
                    </div>
                </div>
            </section>

            <section className="photo-section">
                <div className="container">
                    <PhotoDisplay />
                </div>
            </section>

            <section className="music-section">
                <div className="container">
                    <AudioPlayer onTimeUpdate={handleTimeUpdate} />
                </div>
            </section>

            <section className="lyrics-section">
                <div className="container">
                    <LyricsScroller currentTime={currentTime} />
                </div>
            </section>

            <section className="form-section">
                <div className="container">
                    <MessageForm />
                </div>
            </section>

            <footer className="footer">
                <div className="container text-center">
                    <p className="text-muted">С любовью, 2025</p>
                </div>
            </footer>
        </div>
    )
}

export default MainPage
