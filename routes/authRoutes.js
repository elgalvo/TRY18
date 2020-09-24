const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const authMiddlewares = require('../middlewares/authMiddlewares')

// REGISTRO DE USUÁRIO
router.get('/register', authController.registerRender)

// CRIAR USUÁRIO
router.post('/register/new', authController.register)

// LOGIN
router.get('/login', (req,res)=>{
    //Se o usuário já estiver logado ele é redirecionado
    const user = req.session.user
    if (user){
        res.redirect('/auth/teste')
    } else {
        res.render('auth/login')
    }
})

// PROCESSA A LÓGICA DE LOGIN
router.post('/login/auth', authController.login)

// ESQUECI A SENHA
router.get('/forgot', authController.forgotRender)
router.post('/forgot', authController.forgotPassword)

router.get('/logout', (req,res)=>{
    req.session.user = undefined
    req.flash('success', 'Volte sempre')
    res.redirect('/auth/login')
})


module.exports = router