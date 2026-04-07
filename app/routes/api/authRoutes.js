const express = require('express')
const router = new express.Router()
const authController = require('../../controllers/auth-controllers');
const authMiddleware = require('../../middleware/auth-middleware')
const isAdmin = [authMiddleware.verifyToken, authMiddleware.checkAdmin]

router.get('/users', isAdmin, authController.getUsers)

router.get('/users/me', authMiddleware.verifyToken, authController.getMe)

router.post('/login', authController.login)

router.post('/register', authController.register)

router.delete('/users/:id', isAdmin, authController.delete)

router.post('/logout', authController.logout)

router.patch('/users/me', authMiddleware.verifyToken, authController.editMe)

router.patch('/users/me/password', authMiddleware.verifyToken, authController.changeMyPassword)

router.patch('/users/:id', isAdmin, authController.edit)

module.exports = router
