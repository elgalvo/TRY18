const authMiddlewares = {
    isAdmin: (req, res, next)=>{
        if (req.session.user != undefined){
            if(req.session.user.admin == true){
                next()
            } else {
                res.redirect('/auth/login')
            }
        } else {
            res.redirect('/auth/login')
        }
    },

    isLogged: (req,res,next)=>{
        if(req.session.user != undefined){
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}

module.exports = authMiddlewares