const Vales = require('../models/Vales')
const User = require('../models/User')


const UserController = {
    userProfile: async(req,res)=>{
        try {
            var id = req.params.id
            const user = await User.findOne({_id: id})
            const vales = await Vales.find({user: id}).sort({createdAt:'desc'})

            var today = new Date()
            var month = today.getMonth()
            var year = today.getFullYear()

            function sameMonthNYear(vale){
                if(vale.createdAt.getMonth() == month){
                    if(vale.createdAt.getFullYear() == year){
                        return vale
                    }
                }
            }
            let valesFilter = vales.filter(sameMonthNYear)

            function valorTotaldoMes (total, vales){
                return total + vales.value
            }
            var valorTotalVales = valesFilter.reduce(valorTotaldoMes, 0)
            var salarioAtual = user.salary - valorTotalVales

            res.render('user/user', {userProfile: user, valorTotalVales: valorTotalVales, salarioAtual:salarioAtual, vales:valesFilter})
        } catch (error) {
            console.log(error)
        }
    },


    userEdit: async(req,res)=>{
        var userId = req.params.id
        try {
            if((req.session.user.id == userId) || (req.session.user.admin)){
                const user = await User.findOne({_id: userId})
                res.render('user/userEdit', {userProfile: user})
            } else {       
                req.flash('error', 'Você não tem autorização para acessar essa página.')
                res.redirect('/financeiro')
            }


        } catch (error) {
            console.log(error)
        }
    },

    userEditSave: async(req,res)=>{
        try {
            var {name, email, salary, id} = req.body
            const actualUserData = await User.findOne({_id:id})
            

            if((req.session.user.id == id) || (req.session.user.admin)){
                if(!name){
                    name = actualUserData.name
                } 

                if(!email){
                    email = actualUserData.email
                }
                if(!salary){
                    salary = actualUserData.salary
                }

                await User.updateMany({_id:id}, {name:name, salary:salary, email:email})

                //Recarrega a sessão para o usuário logado
                if(req.session.user.id == id){
                    const user = await User.findOne({_id:id})
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        admin: user.admin,
                        salary: user.salary,
                        name: user.name
                    }
                }

                req.flash('success', 'Usuário atualizado com sucesso')
                res.redirect('/financeiro')
            } else {
                req.flash('error', "Você não tem autorização para esta ação.")
                res.redirect('/financeiro')
            }
        } catch (error) {
            console.log(error)
        }
    },
}

module.exports = UserController