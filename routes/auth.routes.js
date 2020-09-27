const router = require('express').Router();

const AuthController = require("../controller/auth");

// REGISTRO DE USUÁRIO
router.get('/register', (req, res) => res.render('auth/register'));
// CRIAR USUÁRIO
router.post('/register/new', AuthController.postRegister);

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
router.post('/login/auth', AuthController.postLogin);

// ESQUECI A SENHA
router.get('/forgot', (req,res)=> res.render('auth/forgotPassword'));
router.post('/forgot', AuthController.postForgotPassword);

router.get('/logout', (req,res)=>{
    req.session.user = undefined
    req.flash('success', 'Volte sempre')
    res.redirect('/auth/login')
})

module.exports = router
