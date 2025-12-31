import './PhotoDisplay.css'

const PhotoDisplay = () => {
    return (
        <div className="photo-display slide-up">
            <div className="photo-frame glass">
                <img
                    src="/photo.jpg"
                    alt="Воспоминания"
                    className="photo-image"
                    loading="lazy"
                />
                <div className="photo-overlay"></div>
            </div>
        </div>
    )
}

export default PhotoDisplay
