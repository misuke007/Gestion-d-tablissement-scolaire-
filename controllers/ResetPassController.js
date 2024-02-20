const { UE, EC, Utilisateur, Semestre, Filiere, Jour, Heure, ProfEdt, Edt , Etudiant , Note  , MoyenneUE , Repechage , MoyenneGenerale , CDT , ProfEtat , OperationVH} = require('../models')
const { Op } = require('sequelize')
const passport = require("passport")
const {date} = require('../librairies/date')
const {mailToken} = require('../librairies/sendMail')
const {generateToken} = require('../librairies/generateToken')
const bcrypt = require('bcryptjs')






exports.resetPassForm = (req, res) => {

    return res.render('form-reset-pass/resetPassForm')
}





exports.resetPassword = async(req , res) => {

    const {email} = req.body
    const resetToken = generateToken()

    try{

        let dataUser = await Utilisateur.findOne({where:{email}})

        if(dataUser){

            dataUser.resetToken = resetToken
            await dataUser.save()
            mailToken(resetToken)
            return res.render('form-reset-pass/verificationToken' , {email})

        }else{

            req.flash('error' , `Cet adresse Email n'existe pas`)
            return res.redirect('/reset/resetPass/form')
        }


    }catch(error){

        console.log(error);
    }
}






exports.verificationToken = async(req, res) => {


    let {token , email} = req.body
    token = token.trim()

    try{

        let dataUser = await Utilisateur.findOne({where:{email}})

        if(dataUser.resetToken == token){

        return res.render('form-reset-pass/formNewPass' , {email})

        }else{

           let error = "Code invalide"
           return res.render('form-reset-pass/verificationToken' , {email , error})

        }

    }catch(error){

        console.log(error);
    }
}







exports.resetChangePass = async(req , res ) => {

    const {email , password , confirmPass} = req.body

    try{

        if(password == confirmPass){

            let dataUser = await Utilisateur.findOne({where:{email}})
            let hashedPass = bcrypt.hashSync(password , 12)
            dataUser.password = hashedPass
            dataUser.resetToken = null
            await dataUser.save()
            req.flash('success' , 'Réinitialisation de mot de passe réussi!')
            return dataUser.badge == 'ETUDIANT' ?  res.redirect('/etudiant/login') : res.redirect('/admin/login')

        }else{
            
            let error =  'Veuillez vérifier la confirmation de votre mot de passe'
            return res.render('form-reset-pass/formNewPass' , {email , error})
        }
    }catch(error){

        console.log(error);
    }
}