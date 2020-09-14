const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddlewares')
const finantialController = require('../controller/finantialController')

router.get('/', authMiddleware.isLogged, finantialController.financeiro )

router.get('/newvale', authMiddleware.isLogged, (req,res)=>{
    res.render('finantial/newvale')
})

router.post('/newvale/save', authMiddleware.isLogged, finantialController.newvale)

router.get('/edit/:id', authMiddleware.isLogged, finantialController.editVale)
router.post('/edit/save', authMiddleware.isLogged, finantialController.saveEdit)


router.post('/edit/execute', authMiddleware.isLogged, authMiddleware.isAdmin, finantialController.executeVale)


module.exports = router