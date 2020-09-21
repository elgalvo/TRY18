const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const authMiddleware = require('../middlewares/authMiddlewares')

router.get('/:id', authMiddleware.isLogged, userController.userProfile )


module.exports = router

