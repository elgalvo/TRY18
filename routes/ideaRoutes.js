const express = require('express')
const ideaController = require('../controller/ideaController')
const authMiddlewares = require('../middlewares/authMiddlewares')
const router = express.Router()

// NOVA IDEIA
router.get('/newidea', authMiddlewares.isLogged, ideaController.newIdea)

//SALVAR IDEIA
router.post('/saveIdea', authMiddlewares.isLogged, ideaController.newIdeaSave)

//SALVAR EDIÇÃO DA IDEIA
router.post('/saveEditIdea', authMiddlewares.isLogged, ideaController.saveEditIdea)

// EXIBIR TODAS AS IDEIAS
router.get('/', authMiddlewares.isLogged, ideaController.allIdeas)

//PÁGINA DE EDIÇÃO DA IDEIA
router.get('/edit/:id', authMiddlewares.isLogged, ideaController.editIdea)

//DELETAR IDEIA
router.post('/delete', authMiddlewares.isLogged, ideaController.deleteIdea)

module.exports = router