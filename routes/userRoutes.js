const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const authMiddleware = require('../middlewares/authMiddlewares')

router.get('/:id', authMiddleware.isLogged, userController.userProfile )
router.get('/edit/:id', authMiddleware.isLogged, userController.userEdit )
router.post('/edit/save', authMiddlewares.isLogged, userController.userEditSave)


module.exports = router

