const User = require('../models/User')
const bcrypt = require('bcrypt')

const authController = { 
    register: async (req,res)=>{
        const {name, email, password, salary} = req.body

        try {
            if(!name || !email || !password || !salary){
                res.redirect('/auth/register')
            } else {
                const userFind = await User.findOne({where:{email:email}})
                if(userFind){
                    res.redirect('/auth/register')
                } else{
                    const newUser = await User.create({name: name, email:email, salary:salary, password: bcrypt.hashSync(password, 10)})
                    res.redirect('/auth/login')
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
                res.redirect('/auth/login')
            } else {
                const user = await User.findOne({where:{email: email}})
                var correct = bcrypt.compareSync(password, user.password)
                if(correct){
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        admin: user.admin,
                        salary: user.salary
                    } 
                    res.json(req.session.user.admin)
                } else {
                    res.redirect('/auth/login')
                }
            }
         
        } catch (error) {
            res.redirect('/auth/login')
        }
    },
}

module.exports = authController