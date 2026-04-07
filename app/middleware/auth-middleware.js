const jwt = require('jsonwebtoken')
require('dotenv').config();

class authMiddleware {
    verifyToken(req, res, next) {
        const token = req.cookies.authToken
        if (!token) {
            return res.status(401).json({ message: 'Brak tokena autoryzacyjnego. Zaloguj się ponownie.' })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            next()
        } catch (error) {
            return res.status(403).json({ error: 'Nieprawidłowy lub wygasły token. Zaloguj się ponownie.' })
        }
    }
    checkAdmin(req, res, next) {
        try {
            if (req.user.admin === 0) {
                return res.status(403).json({ message: "Wymagane uprawnienia administratora." })
            }
            next()
        } catch (error) {
            return res.status(401).json({ message: `Nieprawidłowy lub wygasły token autoryzacyjny.` })
        }
    }
}

module.exports = new authMiddleware()