const Vales = require('../models/Vales')
const User = require('../models/User')


const finantialController = {
    financeiro: async (req,res)=>{
        //Consulta na DATABASE para retornar todos os vales
        try {
            const vales = await Vales.findAll({
                where:
                    {
                    userId: req.session.user.id
                    },
                include: [{model:User}]
            })

            // Filtra todos os vales pelo mês atual
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

            // Pega o valor total dos vales no mês atual
            function valorTotalValesMes (total, vale){
                return total + vale.value
            }
            var valorTotalVales = valesFilter.reduce(valorTotalValesMes,0)
            var salaryUpdated = req.session.user.salary - valorTotalVales

            res.render('finantial/financeiro', {vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
        } catch (error) {
            console.log(error)
        }
    },

    newvale: async (req,res)=>{
        const {value, description} = req.body

        try {
            if(!value){
                res.redirect('/financeiro/newvale')
            } else {
                const vale = await Vales.create({value:value, description:description, userId:req.session.user.id})
                res.redirect('/financeiro')
            }
        } catch (error) {
            res.json(error)
        }
    },

    editVale: async (req,res)=>{
        try {
            var id = req.params.id

            if(isNaN(id)){
                res.redirect('/financeiro')
            }
    
            await Vales.findAll({where:{
                id: id,
                userId: req.session.user.id
            }}).then((vale)=>{
                if(vale[0].executed == true){
                    res.redirect('/financeiro')
                } else{
                    res.render('finantial/edit', {vale:vale})
                }
            })
        } catch (error) {
            console.log(error)
        }  
    },
    saveEdit: async(req,res)=>{
        try {
            var {value, description, id} = req.body

            console.log(value)

            if (!value){
                await Vales.update({
                    description: description
                },{
                    where:{
                        id:id
                    }
                })
                res.redirect('/financeiro')
            } else if(!description) {
                await Vales.update({
                    value: value
                }, {where:{
                    id:id
                }})
                res.redirect('/financeiro')
            } else {
                await Vales.update({
                    value: value,
                    description: description
                }, {where:{
                    id:id
                }})
            }

        } catch (error) {
            console.log(error)
        }
    },

    executeVale: async (req,res)=>{
        try {
            var {id, userId} = req.body

            const vale = await Vales.findOne({where: {
                id:id,
                userId:userId
            }})

            if(vale.executed){
                res.redirect('/financeiro')
            } else if(!req.session.user.admin){
                res.redirect('/financeiro')
            } else {
                await Vales.update({
                    executed: true,
                }, {where:{
                    id:id,
                    userId: userId
                }})
                res.redirect('/financeiro')
            }

        } catch (error) {
            
        }
    }

}

module.exports = finantialController