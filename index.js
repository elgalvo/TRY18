const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectionDb = require('./database/database')
const flash = require('express-flash')


const app = express()

//SQL DATABASE
connectionDb.authenticate().then(()=>{
    console.log('conexão com a DB feita')
}).catch((error)=>{
    console.log(error)
})


// MIDDLEWARE ----------------
app.use(express.json())
app.use(express.urlencoded({extended:true}))
require('dotenv').config()
app.use(helmet())
app.use(morgan('common'))
app.use(cookieParser('Secretstring'))
app.use(session({
    secret: process.env.SECRET,
    cookie:{
        maxAge: 999999
    },
    resave: false,
    saveUninitialized: true,
}))
app.use(flash())


app.locals.dayjs = require('dayjs')
app.use((req,res,next) =>{
    res.locals.userLogged = req.session.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

// EJS ------------------------
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layouts')
app.use(expressLayouts)
app.use(express.static('public'))


//ROUTES
const authRoutes = require('./routes/authRoutes')
const finantialRoutes = require('./routes/finantialRoutes')
const userRoutes = require('./routes/userRoutes')
const ideaRoutes = require('./routes/ideaRoutes')


app.use("/auth", authRoutes)
app.use("/financeiro", finantialRoutes)
app.use("/user", userRoutes)
app.use('/ideas', ideaRoutes)
app.get('/', (req,res)=>{
    res.redirect('/financeiro')
})



// SERVER ------------------------
app.listen(process.env.PORT, ()=>{
    console.log('Running on' + process.env.PORT)
})