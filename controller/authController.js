const User = require('../models/User')
const bcrypt = require('bcrypt')

const authController = { 
    register: async (req,res)=>{
        const {name, email, password, salary} = req.body

        try {
            if(!name || !email || !password || !salary){
                req.flash("error", "Os dados que você digitou são inválidos")
                res.redirect('/auth/register')
            } else {
                const userFind = await User.findOne({where:{email:email}})
                if(userFind){
                    req.flash("error","Já existe um usuário com esse e-mail")
                    res.redirect('/auth/register')
                } else{
                    const newUser = await User.create({name: name, email:email, salary:salary, password: bcrypt.hashSync(password, 10)})
                    res.flash("success", "Usuário criado com sucesso")
                    res.redirect('/')
                }
            }
        } catch (error){
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
                const user = await User.findOne({where:{email: email}})
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
}

module.exports = authController