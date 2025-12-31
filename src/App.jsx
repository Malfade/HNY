import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import AdminPage from './pages/AdminPage/AdminPage'
import SnowEffect from './components/SnowEffect/SnowEffect'

function App() {
    return (
        <Router>
            <SnowEffect />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    )
}

export default App
