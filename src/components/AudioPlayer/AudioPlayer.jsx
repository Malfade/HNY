import { useState, useRef, useEffect } from 'react'
import './AudioPlayer.css'

const AudioPlayer = ({ onTimeUpdate }) => {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.7)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => {
            setCurrentTime(audio.currentTime)
            if (onTimeUpdate) {
                onTimeUpdate(audio.currentTime)
            }
        }

        const updateDuration = () => {
            setDuration(audio.duration)
        }

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
        }
    }, [onTimeUpdate])

    const togglePlay = () => {
        const audio = audioRef.current
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleSeek = (e) => {
        const audio = audioRef.current
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = x / rect.width
        const newTime = percentage * duration
        audio.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        audioRef.current.volume = newVolume
    }

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <div className="audio-player glass">
            <audio ref={audioRef} src="/music.mp3" />

            <div className="player-info">
                <h4 className="song-title">Still Loving You</h4>
                <p className="song-artist">Scorpions</p>
            </div>

            <div className="player-controls">
                <button
                    className="play-button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <div className="time-display">{formatTime(currentTime)}</div>

                <div className="progress-container" onClick={handleSeek}>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="time-display">{formatTime(duration)}</div>

                <div className="volume-control">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="volume-icon">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                        aria-label="Volume"
                    />
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer
