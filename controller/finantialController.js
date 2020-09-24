const Vales = require('../models/Vales')
const User = require('../models/User')
const mongoose = require('mongoose')


const finantialController = {
    financeiroPrincipal: async (req,res)=>{
        //Consulta na DATABASE para retornar todos os vales
        try {
            Vales.find({user:req.session.user.id}).sort({createdAt:'desc'}).exec((err, vales)=>{
                if(err){
                    console.log(err)
                } else {
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
                        return total + parseFloat(vale.value)
                    }
                    var valorTotalVales = valesFilter.reduce(valorTotalValesMes,0)
                    var salaryUpdated = req.session.user.salary - valorTotalVales
                    res.render('finantial/financeiro', {vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
                }
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    newVale: async (req,res)=>{
        const {value, description} = req.body

        if(!value){
            req.flash("error","Digite um valor válido")
            res.redirect('/financeiro/newvale')
        } else {
            try {
                const vale = new Vales({value:value, description:description, user:req.session.user.id})
                const savedVale = vale.save()
                req.flash('success', 'Vale criado.')
                res.redirect('/financeiro')
            } catch (error) {
                console.log(error)
            }
        }
    },

    editVale: async (req,res)=>{
        try {
            var id = req.params.id
            
            // Filtra os vales pelo ID DO VALE e pelo ID DO USUÁRIO
            await Vales.findOne({ _id: id, user: req.session.user.id}).then((vale)=>{
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

    saveEditVale: async(req,res)=>{
        try {
            var {value, description, id} = req.body

            // Procura o vale pelo ID
            const actualValeData = await Vales.findOne({_id:id})
            res.json(actualValeData)

            if(!value){
                value = actualValeData.value

            }
            if(!description){
                description = actualValeData.description
            }

            const vale = await Vales.updateMany({_id:actualValeData._id}, {value:value, description:description},(err, done)=>{
                if(err){
                    console.log(err)
                } else {
                    req.flash('success', 'Vale editado com sucesso!')
                    res.redirect('/financeiro')
                }
            })
        } catch (error) {
            console.log(error)
        }
    },

    executeVale: async (req,res)=>{
        try {
            var {id, user} = req.body
            const vale = await Vales.findOne({
                 _id:id
            })
            
            if(vale.executed){
                req.flash('error', "Este vale já foi pago.")
                res.redirect('/financeiro')

            } else if(!req.session.user.admin){

                req.flash("error","Você não tem autorização para essa ação.")
                res.redirect('/financeiro')

            } else {
                await Vales.updateOne({_id: vale._id}, {executed: true}, (err,data)=>{
                    if(err){
                        res.json(err)
                        console.log(err)
                    } else{
                        req.flash('success',"Vale pago.")
                        res.redirect('/financeiro')
                    }
                })
            }

        } catch (error) {
            console.log(error)
        }
    },

    filterVales: async (req,res)=>{
        var {month, year, user} = req.body

        if(!user){
            //Consulta na DATABASE para retornar todos os vales
            try {
                const userProfile = await User.findOne({_id: req.session.user.id})
                const vales = await Vales.find({user: req.session.user.id}).sort({createdAt:'desc'})
        
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
        
                res.render('finantial/financeiroFilter', {userProfile: userProfile, vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
            } catch (error) {
                console.log(error)
            }

        } else {
            //Consulta na DATABASE para retornar todos os vales
            try {

                const userProfile = await User.findOne({_id: user})
                const vales = await Vales.find({user: user}).sort({createdAt:'desc'})

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
        
                res.render('finantial/financeiroFilter', {userProfile: userProfile, vales: valesFilter, valesTotalValue: valorTotalVales, salaryUpdated: salaryUpdated})
            } catch (error) {
                console.log(error)
            }

        }
        

 
    },

    deleteVale: async(req,res)=>{
        try {
            var {id, userId} = req.body

            if((req.session.user.admin) || (req.session.user.id == userId)){
                await Vales.deleteOne({_id: id})
                req.flash('success',"Vale apagado.")
                res.redirect('/financeiro')
            } else {
                req.flash('error',"Você não tem autorização para deletar.")
                res.redirect('/financeiro')
            }
        } catch (error) {
            
        }
    },

    allPayCheck: async(req,res)=>{
        try {
            const users = await User.find()

            res.render('finantial/paycheck', {users:users})
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = finantialController