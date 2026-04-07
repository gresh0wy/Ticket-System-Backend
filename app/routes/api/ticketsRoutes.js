const express = require('express')
const router = new express.Router()
const ticketControllers = require('../../controllers/ticket-controllers')
const authMiddleware = require('../../middleware/auth-middleware')
const isAdmin = [authMiddleware.verifyToken, authMiddleware.checkAdmin]

router.post('/tickets', ticketControllers.createTickets);

router.get('/tickets', isAdmin, ticketControllers.showAllTickets)

router.get('/ticketsDetails/:id', isAdmin, ticketControllers.showTickets)

router.get('/tickets/:id/status', ticketControllers.statusTickets)

router.delete('/tickets/:id', isAdmin, ticketControllers.deleteTickets)

router.patch('/tickets/:id', isAdmin, ticketControllers.editTickets)

module.exports = router