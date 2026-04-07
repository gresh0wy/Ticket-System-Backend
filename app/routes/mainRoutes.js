const express = require('express')
const router = new express.Router()

const globalController = require('../controllers/global-controller')
const authMiddleware = require('../middleware/auth-middleware')
const isAdmin = [authMiddleware.verifyToken, authMiddleware.checkAdmin]

router.get('/', globalController.showHome)

router.get('/login', globalController.showLogin)

router.get('/profil', isAdmin, (req, res) => {

    res.json({ message: "strona profilu " })
})


module.exports = router