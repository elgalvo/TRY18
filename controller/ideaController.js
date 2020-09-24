
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
                const idea = await Idea.create({title: title, description:description, user: req.session.user.id})
                const ideaSaved = await idea.save()
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
                const idea = await Idea.findOne({_id:id}).sort({createdAt:'desc'})
                res.render('ideas/ideaPage', {idea:idea})
            }
        } catch (error) {
            console.log(error)
        }
    },
    
    saveEditIdea: async (req,res)=>{
        try {
            var {title, description, id} = req.body
            const actualIdeaData = Idea.findOne({_id:id})

            if(!title){
                title = actualIdeaData.title
            }
            if(!description){
                description = actualIdeaData.description
            }
            await Idea.update({_id:id}, {title:title, description:description})
            req.flash('success', 'Ideia editada com sucesso')
            res.redirect('/ideas')
        } catch (error) {
            console.log(error)
        }
        
    },

    allIdeas: async(req,res)=>{
        const allIdeas = await Idea.find().populate('user').sort({createdAt:'desc'})
        res.render('ideas/ideas', {allIdeas:allIdeas})
    },

    deleteIdea: async(req,res)=>{
        var id = req.body.id
        
        if((req.session.user.id == id) || req.session.user.admin ){
            await Idea.deleteOne({_id:id}, (err, data)=>{
                if(err){
                    req.flash('error', err)
                    res.redirect('/ideas')
                } else {
                    req.flash('success', "Ideia apagada.")
                    res.redirect('/ideas')
                }
            })

        }
    }


}

module.exports = ideaController