
const Idea = require('../models/Idea') 
const User = require('../models/User')

const ideaController = {
    newIdea: (req,res)=>{
        res.render('ideas/newidea')
    },


    newIdeaSave: async (req,res)=>{
        const {title, description} = req.body
        try {
            if(!title){
                req.flash('error',"Sua ideia precisa de um título.")
                res.redirect('/ideas/newidea')
            } else {
                const idea = await Idea.create({title: title, description:description, userId: req.session.user.id})
                req.flash('success',"Ideia criada! Muito obrigado pela contribuição! :D")
                res.redirect('/ideas')
            }
        } catch (error) {
            console.log(error)
        }
        
    },

    editIdea: async (req,res)=>{
        const id = req.params.id
        console.log(id)
        try {
            if(!id){
                req.flash('error','Página inválida')
                res.redirect('/')
            } else {
                const idea = await Idea.findOne({where:{id:id}})
                res.render('ideas/ideaPage', {idea:idea})
            }
        } catch (error) {
            console.log(error)
        }
    },
    
    saveEditIdea: async (req,res)=>{
        const {title, description, id} = req.body


        if(!title){
            await Idea.update({description:description}, {where:{id:id}}).then((idea)=>{
                req.flash('success',"Ideia alterada com sucesso.")
                res.redirect('/ideas')
            })
        } else if(!description){
            await Idea.update({title: title}, {where:{id:id}}).then((idea)=>{
                req.flash('success','Ideia alterada com sucesso')
                res.redirect('/ideas')
            })
        } else if (title && description){
            await Idea.update({title: title, description: description}, {where:{id:id}})
            req.flash('succes', 'Ideia alterada com sucesso')
            res.redirect('/ideas')
        }
    },

    allIdeas: async(req,res)=>{
        const allIdeas = await Idea.findAll({include:{model:User}, order:[['createdAt', 'DESC']],})
        res.render('ideas/ideas', {allIdeas:allIdeas})
    },



}

module.exports = ideaController