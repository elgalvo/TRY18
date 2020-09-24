const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const authController = { 
    register: async (req,res)=>{
        try {
            const {name, email, password1, password2, salary} = req.body
            if(!name || !email || !password1 || !password2 || !salary){
                req.flash("error", "Os dados que você digitou são inválidos")
                res.redirect('/auth/register')
            } else if(password1 != password2) {
                req.flash('error', "As senhas não são iguais")
                res.redirect('/auth/register')
            } else {
                const userFind = await User.findOne({email: email}, async (err, user)=>{
                    if(user){
                        req.flash("error","Já existe um usuário com esse e-mail")
                        res.redirect('/auth/register')
                    } else {
                        const newUser = new User({name: name, email:email, salary:salary, password: bcrypt.hashSync(password1, 10)})
                        const newUserSave = await newUser.save()
                        req.flash("success", "Usuário criado com sucesso")
                        res.redirect('/')
                    }
                })
            }
        } catch (error) {
            console.log(error) 
        }
        
    }, 

    registerRender: (req,res)=>{
        res.render('auth/register')
    },

    login: async (req,res)=>{
        var {email, password} = req.body
        try {
            if(!email || !password){
                req.flash("error", "Verifique os dados digitados.")
                res.redirect('/auth/login')
            } else {
                const user = await User.findOne({email: email})
                var correct = bcrypt.compareSync(password, user.password)
                if(correct){
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        admin: user.admin,
                        salary: user.salary,
                        name: user.name
                    } 
                    res.redirect('/financeiro')
                } else {
                    req.flash("error", "Senha ou e-mail incorretos")
                    res.redirect('/auth/login')
                }
            }
         
        } catch (error) {
            res.redirect('/auth/login')
        }
    },

    forgotRender: (req,res)=>{
        res.render('auth/forgotPassword')
    },

    forgotPassword: async(req,res)=>{
        const  {email} = req.body
        var token = crypto.randomBytes(20).toString('hex')
        try {
            const user = await User.findOne({where:{email:email}})
            
            if(!user){
                req.flash('error', 'Nenhum usuário encontrado com esse e-mail. Verifique o email digitado.')
                res.redirect('/forgot')
            } else {
                await User.update({resetPasswordToken: token, resetPasswordExpires: Date.now()+3600000}, {where:{id: user.id}})
                
                var transOptions = {
                    host: 'mail.brindel.com.br',
                    port: 465,
                    secure: true,
                    auth:{
                        user:'contato@brindel.com.br',
                        pass: 'Brindel2019'
                    },
                    tls:{
                        rejectUnauthorized: false
                    }
                }

                var smtpTransport = nodemailer.createTransport(transOptions)
        
                var mailOptions = {
                    from: 'contato@brindel.com.br',
                    to: user.email,
                    subject: 'Sua recuperação de senha',
                    text:`Olá,  ${user.name}. Você está recebendo esse e-mail porquê solicitou uma recuperação de senha.
                        Clique no link para poder redefinir sua senha. https://${req.headers.host}/auth/reset/${token}`
                }

                smtpTransport.sendMail(mailOptions, (err, info)=>{
                    if(err){
                        console.log(err)
                    } else {
                        console.log('Mail sent')
                        req.flash('success', 'Email enviado! Cheque sua caixa de entrada')
                        res.redirect('/auth/forgot')
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
        
        

        





    },
}

module.exports = authController