const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const authMiddlewares = require('../middlewares/authMiddlewares')

// Rotas de Registro
router.get('/register', authMiddlewares.isAdmin, authController.registerRender)

router.post('/register/new', authMiddlewares.isAdmin, authController.register)


//Rotas de Login
    //Rota que renderiza página
router.get('/login', (req,res)=>{
    //Se o usuário já estiver logado ele é redirecionado
    const user = req.session.user
    if (user){
        res.redirect('/auth/teste')
    } else {
        res.render('auth/login')
    }
})

    //Rota que executa o Login
router.post('/login/auth', authController.login)




router.get('/teste', authMiddlewares.isLogged, (req,res)=>{
    res.json(req.session.user)
})


    // Rota de deslogar
router.get('/logout', (req,res)=>{
    req.session.user = undefined
    req.flash('success',"Volte sempre.")
    res.redirect('/auth/login')
})


module.exports = router