const express = require('express')
const layout = require('express-ejs-layouts')
const fileupload = require('express-fileupload')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const database = require('./models')
const path = require('path')

const adminRoute = require('./routes/AdminRoute')
const etudiantRoute = require('./routes/EtudiantRoute')
resetPassRoute = require('./routes/ResetPassRoute')
require('./config/passport')(passport)

const app = express()


app.use(layout)
app.set('view engine' , 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(flash())
app.use(fileupload())
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:false}))

app.use(session({
    resave:true,
    secret:'universiteK9o56k0097',
    saveUninitialized:true
}))



app.use((req,res, next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.pass = req.flash('pass')
    next()

})

app.use(passport.initialize())
app.use(passport.session())

app.use('/admin' , adminRoute)
app.use('/etudiant' , etudiantRoute)
app.use('/reset' , resetPassRoute)




database.sequelize.sync()
    .then(() => {

        app.listen(9000 , () => {

            console.log(`Server started on  http://localhost:9000/admin/home`);
        })
    })

    .catch(error => console.log(error))