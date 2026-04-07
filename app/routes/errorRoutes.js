const express = require('express')
const router = new express.Router()
const ErrorControllers = require('../controllers/error-controllers')

router.use(ErrorControllers.notFound)


module.exports = router