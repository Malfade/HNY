// Simple admin password - CHANGE THIS FOR PRODUCTION
const ADMIN_PASSWORD = 'newyear2025'

/**
 * Middleware to check admin authorization
 */
export const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization required' })
    }

    const token = authHeader.replace('Bearer ', '')

    if (token !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    next()
}
