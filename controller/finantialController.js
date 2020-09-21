const Vales = require('../models/Vales')
const User = require('../models/User')


const finantialController = {
    financeiro: async (req,res)=>{
        //Consulta na DATABASE para retornar todos os vales
        try {
            const vales = await Vales.findAll({
                where:{userId: req.session.user.id},
                include: [{model:User}],
                order:[['createdAt', 'DESC']],
            })

            // Filtra todos os vales pelo mês atual
            var today = new Date()
            var month = today.getMonth()
            var year = today.getFullYear()

            //Pega todos os vales do mesmo mês e ano atual
            function sameMonthNYear(vale){
                if(vale.createdAt.getMonth() == month){
                    if(vale.createdAt.getFullYear() == year){
                        return vale
                    }
                }
            }
            let valesFilter = vales.filter(sameMonthNYear)

            // Pega o valor total dos vales no mês atual e diminui pelo salário do usuário logado
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
                req.flash("error","Digite um valor válido")
                res.redirect('/financeiro/newvale')
            } else {
                const vale = await Vales.create({value:value, description:description, userId:req.session.user.id})
                req.flash("success", "Vale criado com sucesso!")
                res.redirect('/financeiro')
            }
        } catch (error) {
            res.json(error)
        }
    },

    editVale: async (req,res)=>{
        try {
            var id = req.params.id

            // Se não for número
            if(isNaN(id)){
                req.flash('error',"Vale inválido.")
                res.redirect('/financeiro')
            }
            
            // Filtra os vales pelo ID DO VALE e pelo ID DO USUÁRIO
            await Vales.findOne({where:{
                id: id,
                userId: req.session.user.id,
            }}).then((vale)=>{
                if(vale.executed == true){ // Se o vale já tiver sido pago
                    req.flash('error',"Esse vale já foi pago, não é possível alterá-lo.")
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
            let {value, description, id} = req.body

            // Procura o vale pelo ID
            const valeSearch = await Vales.findOne({where:{id:id}})


            if(!value){
                await Vales.update({description:description}, {where: {id:id}})
                req.flash('success', "Vale alterado.")
                res.redirect('/financeiro')

            }else if(description == null){
                res.json(true)
                await Vales.update({value:value}, {where:{id:id}})
                req.flash('success',"Vale alterado.")
                res.redirect('/financeiro')
            } else {
                Vales.update({value:value, description:description}, {where: {id:id}})
                req.flash('success',"Vale alterado.")
                res.redirect('/financeiro')
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
                req.flash('error', "Este vale já foi pago.")
                res.redirect('/financeiro')
            } else if(!req.session.user.admin){
                req.flash("error","Você não tem autorização para essa ação.")
                res.redirect('/financeiro')
            } else {
                await Vales.update({
                    executed: true,
                }, {where:{
                    id:id,
                    userId: userId
                }})
                req.flash('success',"Vale pago.")
                res.redirect(req.originalUrl)
            }

        } catch (error) {
            
        }
    },

    financeiroFilterUserLogged: async (req,res)=>{
        var {month, year, userid} = req.body

        if(!userid){
            //Consulta na DATABASE para retornar todos os vales
            try {
                const user = await User.findOne({
                    where:{
                        id: req.session.user.id
                    }
                })
                const vales = await Vales.findAll({
                    where:
                        {
                        userId: req.session.user.id
                        },
                    include: [{model:User}],
                    order:[['createdAt', 'DESC']],
                })
        
                //Pega todos os vales do mesmo mês e ano atual
                function sameMonthNYear(vale){
                    if(vale.createdAt.getMonth() == parseInt(month)){
                        if(vale.createdAt.getFullYear() == parseInt(year)){
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
        
                res.render('finantial/financeiroFilter', {userProfile: user, vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
            } catch (error) {
                console.log(error)
            }

        } else {

            //Consulta na DATABASE para retornar todos os vales
            try {
                const user = await User.findOne({
                    where:{
                        id: userid
                    }
                })
                const vales = await Vales.findAll({
                    where:
                        {
                        userId: userid
                        },
                    include: [{model:User}],
                    order:[['createdAt', 'DESC']],
                })
        
                //Pega todos os vales do mesmo mês e ano atual
                function sameMonthNYear(vale){
                    if(vale.createdAt.getMonth() == parseInt(month)){
                        if(vale.createdAt.getFullYear() == parseInt(year)){
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
                var salaryUpdated = user.salary - valorTotalVales
        
                res.render('finantial/financeiroFilter', {userProfile: user, vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
            } catch (error) {
                console.log(error)
            }

        }
        

 
    },

    financeiroFilterUser: async (req,res)=>{
        var {month, year, userid} = req.body


        const user = await User.findOne({where:{id: userid}})
        const vales = await Vales.findAll({where:{userId: userid}, include: [{model:User}]})

        //Pega todos os vales do mesmo mês e ano atual
        function sameMonthNYear(vale){
            if(vale.createdAt.getMonth() == parseInt(month)){
                if(vale.createdAt.getFullYear() == parseInt(year)){
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
        var salaryUpdated = user.salary - valorTotalVales

        res.render('finantial/financeiroFilterUser', {userProfile: user, vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
    },


    deleteVale: async(req,res)=>{
        try {
            var {id, userId} = req.body

            if(req.session.user.admin == false || req.session.user.id != userId){
                req.flash('error',"Você não tem autorização para deletar.")
                res.redirect('/financeiro')
            } else {
                await Vales.destroy({
                    where:{
                        id: id,
                        userId: userId
                    }
                })
                req.flash('success',"Vale apagado.")
                res.redirect('/financeiro')
            }
        } catch (error) {
            
        }
    },

    allPayCheck: async(req,res)=>{
        try {
            const users = await User.findAll()

            res.render('finantial/paycheck', {users:users})
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = finantialController