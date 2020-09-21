const express = require('express')
const ideaController = require('../controller/ideaController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/newidea', authMiddlewares.isLogged, ideaController.newIdea)
router.post('/saveIdea', authMiddlewares.isLogged, ideaController.newIdeaSave)
router.post('/saveEditIdea', authMiddlewares.isLogged, ideaController.saveEditIdea)
router.get('/', authMiddlewares.isLogged, ideaController.allIdeas)
router.get('/:id', authMiddlewares.isLogged, ideaController.editIdea)

module.exports = router