import { useState, useEffect, useRef } from 'react'
import lyrics from '../../utils/lyrics'
import './LyricsScroller.css'

const LyricsScroller = ({ currentTime }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollRef = useRef(null)

    useEffect(() => {
        // Find the current lyric based on time
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                setCurrentIndex(i)
                break
            }
        }
    }, [currentTime])

    useEffect(() => {
        // Auto-scroll to current lyric
        if (scrollRef.current) {
            const activeElement = scrollRef.current.querySelector('.lyric-line.active')
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }
    }, [currentIndex])

    return (
        <div className="lyrics-scroller glass" ref={scrollRef}>
            <div className="lyrics-content">
                {lyrics.map((lyric, index) => (
                    <div
                        key={index}
                        className={`lyric-line ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'passed' : ''
                            }`}
                    >
                        {lyric.text}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LyricsScroller
