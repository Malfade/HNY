import { useEffect, useState } from 'react'
import './SnowEffect.css'

const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState([])

    useEffect(() => {
        const createSnowflakes = () => {
            const flakes = []
            const flakeCount = 50

            for (let i = 0; i < flakeCount; i++) {
                flakes.push({
                    id: i,
                    left: Math.random() * 100,
                    animationDuration: 10 + Math.random() * 20,
                    animationDelay: Math.random() * 10,
                    fontSize: 10 + Math.random() * 10,
                    opacity: 0.3 + Math.random() * 0.7
                })
            }

            setSnowflakes(flakes)
        }

        createSnowflakes()
    }, [])

    return (
        <div className="snow-container">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: `${flake.left}%`,
                        animationDuration: `${flake.animationDuration}s`,
                        animationDelay: `${flake.animationDelay}s`,
                        fontSize: `${flake.fontSize}px`,
                        opacity: flake.opacity
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    )
}

export default SnowEffect
