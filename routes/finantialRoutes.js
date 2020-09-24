const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddlewares')
const finantialController = require('../controller/finantialController')

//PRINCIPAL
router.get('/', authMiddleware.isLogged, finantialController.financeiroPrincipal)

//
router.post('/filter', authMiddleware.isLogged, finantialController.filterVales)
router.get('/newvale', authMiddleware.isLogged, (req,res)=>{res.render('finantial/newvale')})
router.post('/newvale/save', authMiddleware.isLogged, finantialController.newVale)
router.get('/edit/:id', authMiddleware.isLogged, finantialController.editVale)
router.post('/edit/save', authMiddleware.isLogged, finantialController.saveEditVale)
router.post('/delete', authMiddleware.isLogged, finantialController.deleteVale)
//router.post('/filteruser', authMiddleware.isLogged, authMiddleware.isAdmin, finantialController.financeiroFilterUser)
router.get('/paycheck', authMiddleware.isLogged, authMiddleware.isAdmin, finantialController.allPayCheck)
router.post('/edit/execute', authMiddleware.isLogged, authMiddleware.isAdmin, finantialController.executeVale)


module.exports = router