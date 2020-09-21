const Vales = require('../models/Vales')
const User = require('../models/User')


const UserController = {
    userProfile: async(req,res)=>{
        try {
            var userId = req.params.id
            const user = await User.findOne({where:{
                id: userId
            }})
            const vales = await Vales.findAll({where:{
                userId: userId
            },order:[['createdAt', 'DESC']],})

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
}

module.exports = UserController