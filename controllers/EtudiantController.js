const { UE, EC, Utilisateur, Semestre, Filiere, Jour, Heure, ProfEdt, Edt , Etudiant , Note  , MoyenneUE , Repechage , MoyenneGenerale , CDT , ProfEtat , OperationVH} = require('../models')
const { Op } = require('sequelize')
const passport = require("passport")
const {date} = require('../librairies/date')
const {mailToken} = require('../librairies/sendMail')
const {generateToken} = require('../librairies/generateToken')
const bcrypt = require('bcryptjs')

EC.hasOne(CDT)
CDT.belongsTo(EC)
Heure.hasOne(CDT)
CDT.belongsTo(Heure)



exports.home = async(req, res) => {

    const user = req.user

    try{

        let data = await Etudiant.findOne({include : [Utilisateur , Filiere] , where:{UtilisateurId : user.id}})
        return res.render('etudiant/home' , {data})

    }catch(error){console.log(error)}
}





exports.loginForm = (req , res) => {

    return res.render('etudiant/loginForm')
}




exports.postLogin = async(req , res , next) => {

    const  {email , password} = req.body

    if(email == '' || password == ''){
        req.flash('error' , 'Veuillez remplir tous les champs')
        return res.redirect('/etudiant/login')
    }
    
    passport.authenticate('local' , {
        successRedirect:'/etudiant/home',
        failureRedirect:'/etudiant/login',
        failureFlash:true
    })(req, res, next)
}





exports.listeEC = async(req , res) =>{

    const user = req.user
    let bigDataEC = []

    try{

        let dataEtudiant = await Etudiant.findOne({where:{UtilisateurId: user.id}})
        let dataUE = await UE.findAll({where:{SemestreId : dataEtudiant.SemestreId , OptionId : dataEtudiant.OptionId}})

        for(item of dataUE){

            let data = await EC.findAll({where:{UEId : item.id}})
            bigDataEC.push(data)
        }

        return res.render('etudiant/liste_matiere' , {bigDataEC , dataUE})

    }catch(error){

        console.log(error);
    }
}







exports.noteSemestre = async (req, res) => {

    try{

        let data = await Semestre.findAll()
        return res.render('etudiant/noteSemestre' , {data})
    }catch(error){

        console.log(error);
    }
}





exports.noteChoixSem = async(req, res) => {

    const SemestreId = req.params.SemestreId
    const user = req.user
    let uniqId = new Map()
    let bigData =  []

    try{

        let dataEtudiant = await Etudiant.findOne({include : Semestre , where:{UtilisateurId : user.id}})
        let data = await Note.findAll({include : UE , where:{FiliereId : dataEtudiant.FiliereId , SemestreId , UtilisateurId : user.id}})
        let dataMoyenneUE = await MoyenneUE.findAll({ where:{SemestreId , UtilisateurId : user.id}})
        let dataMoyenneG = await MoyenneGenerale.findOne({where:{UtilisateurId : user.id , SemestreId}})
        let dataRepech = await Repechage.findAll({ include : EC , where:{UtilisateurId  : user.id, SemestreId}})
        // let dataEtudiant  = await Etudiant.findOne({include : Semestre , where:{UtilisateurId , FiliereId}})
        // filtrage id des UE pour afficher les ec par UE
        const UElistId = data.filter(objet => {
             if (!uniqId.has(objet.UEId)) {
                uniqId.set(objet.UEId, true);
                    return true;
                }
                    return false;
                 });

        //Selection des EC par UE pour l'affichage  
        
                 for(item of UElistId){

                    let dataNote = await Note.findAll({include : [UE,EC] , where:{FiliereId : dataEtudiant.FiliereId , UtilisateurId : user.id , UEId : item.UEId}})
                    bigData.push(dataNote)
                 }
                    return res.render('etudiant/noteVoir' , {bigData , UElistId , dataMoyenneUE , dataMoyenneG , dataRepech , SemestreId , dataEtudiant})
       
    }catch(error){

        console.log(error);
    }
}





exports.voirEdt = async(req , res) => {

    let [jour1, jour2, jour3, jour4, jour5, jourInit, jourCompar] = [[], [], [], [], [], undefined, undefined]

    try {

        let dataEtudiant = await Etudiant.findOne({where:{UtilisateurId : req.user.id}})
        const [FiliereId, SemestreId] = [dataEtudiant.FiliereId, dataEtudiant.SemestreId]

        let edtDispo = await Edt.findOne({where:{FiliereId , SemestreId}})

        if(edtDispo){

        let dateEDT = date(edtDispo)    
        let dataEdt = await ProfEdt.findAll({ include: [Jour, Heure, EC], where: { [Op.and]: [{ FiliereId }, { SemestreId }] } })
        let lundi = dataEdt.filter(value => value.Jour.nom == 'Lundi')
        let mardi = dataEdt.filter(value => value.Jour.nom == 'Mardi')
        let mercredi = dataEdt.filter(value => value.Jour.nom == 'Mercredi')
        let jeudi = dataEdt.filter(value => value.Jour.nom == 'Jeudi')
        let vendredi = dataEdt.filter(value => value.Jour.nom == 'Vendredi')


        for (item of lundi) {

            jourInit = { id: item.EC.id, nom: item.EC.nom, heure: item.Heure.valeur, jourId: item.JourId, heureId: item.HeureId }
            jour1.push(jourInit)
            break
        }


        for (let i = 0; i < lundi.length; i++) {

            jourCompar = { id: lundi[i].EC.id, nom: lundi[i].EC.nom, heure: lundi[i].Heure.valeur, jourId: lundi[i].JourId, heureId: lundi[i].HeureId }

            if (jour1[jour1.length - 1].nom == jourCompar.nom) {

                jour1[jour1.length - 1].heure = jourCompar.heure
                jour1[jour1.length - 1].heureId = jourCompar.heureId

            } else {

                jour1.push(jourCompar)
            }

        }


        jour1 = jour1.sort((a, b) => {

            return a.heureId - b.heureId
        })





        for (item of mardi) {

            jourInit = { id: item.EC.id, nom: item.EC.nom, heure: item.Heure.valeur, jourId: item.JourId, heureId: item.HeureId }
            jour2.push(jourInit)
            break
        }


        for (let i = 0; i < mardi.length; i++) {

            jourCompar = { id: mardi[i].EC.id, nom: mardi[i].EC.nom, heure: mardi[i].Heure.valeur, jourId: mardi[i].JourId, heureId: mardi[i].HeureId }

            if (jour2[jour2.length - 1].nom == jourCompar.nom) {

                jour2[jour2.length - 1].heure = jourCompar.heure
                jour2[jour2.length - 1].heureId = jourCompar.heureId

            } else {

                jour2.push(jourCompar)
            }

        }


        jour2 = jour2.sort((a, b) => {

            return a.heureId - b.heureId
        })


        for (item of mercredi) {

            jourInit = { id: item.EC.id, nom: item.EC.nom, heure: item.Heure.valeur, jourId: item.JourId, heureId: item.HeureId }
            jour3.push(jourInit)
            break
        }


        for (let i = 0; i < mercredi.length; i++) {

            jourCompar = { id: mercredi[i].EC.id, nom: mercredi[i].EC.nom, heure: mercredi[i].Heure.valeur, jourId: mercredi[i].JourId, heureId: mercredi[i].HeureId }
            if (jour3[jour3.length - 1].nom == jourCompar.nom) {

                jour3[jour3.length - 1].heure = jourCompar.heure
                jour3[jour3.length - 1].heureId = jourCompar.heureId

            } else {

                jour3.push(jourCompar)
            }

        }


        jour3 = jour3.sort((a, b) => {

            return a.heureId - b.heureId
        })



        for (item of jeudi) {

            jourInit = { id: item.EC.id, nom: item.EC.nom, heure: item.Heure.valeur, jourId: item.JourId, heureId: item.HeureId }
            jour4.push(jourInit)
            break
        }


        for (let i = 0; i < jeudi.length; i++) {

            jourCompar = { id: jeudi[i].EC.id, nom: jeudi[i].EC.nom, heure: jeudi[i].Heure.valeur, jourId: jeudi[i].JourId, heureId: jeudi[i].HeureId }
            if (jour4[jour4.length - 1].nom == jourCompar.nom) {

                jour4[jour4.length - 1].heure = jourCompar.heure
                jour4[jour4.length - 1].heureId = jourCompar.heureId

            } else {

                jour4.push(jourCompar)
            }

        }


        jour4 = jour4.sort((a, b) => {

            return a.heureId - b.heureId
        })



        for (item of vendredi) {

            jourInit = { id: item.EC.id, nom: item.EC.nom, heure: item.Heure.valeur, jourId: item.JourId, heureId: item.HeureId }
            jour5.push(jourInit)
            break
        }


        for (let i = 0; i < jeudi.length; i++) {

            jourCompar = { id: jeudi[i].EC.id, nom: jeudi[i].EC.nom, heure: jeudi[i].Heure.valeur, jourId: vendredi[i].JourId, heureId: vendredi[i].HeureId }
            if (jour5[jour5.length - 1].nom == jourCompar.nom) {

                jour5[jour5.length - 1].heure = jourCompar.heure
                jour5[jour5.length - 1].heureId = jourCompar.heureId

            } else {

                jour5.push(jourCompar)
            }

        }


        jour5 = jour5.sort((a, b) => {

            return a.heureId - b.heureId
        })

        return res.render('etudiant/edtVoir', { jour1, jour2, jour3, jour4, jour5, FiliereId, SemestreId , neant : false , dateEDT })

        }else{
        
        let neant = true    
        return res.render('etudiant/edtVoir' , {neant})

        }

    } catch (error) {

        console.log(error);
    }
}





exports.formChangeMdp = (req, res) => {

    return res.render('etudiant/formChangeMdp')
}





exports.postChangeMdp = async(req, res) => {

    const {current_pass , new_pass , confirm_new_pass} = req.body
    const user = req.user

    try{

        let userData = await Utilisateur.findOne({where:{id:user.id}})
        let UserValidPass = bcrypt.compareSync(current_pass , userData.password)

        if(UserValidPass){
            if(new_pass == confirm_new_pass){
                let hashedPass = bcrypt.hashSync(new_pass , 12 )
                let data = {password : hashedPass}
                await Utilisateur.update( data ,{where:{id:user.id}})
                req.flash('success' , 'Votre mot de passe est bien mise à jour!')
                return res.redirect('/etudiant/home')
            }else{

                req.flash('error' , 'Veuillez vérifier la confirmation de votre mot de passe!')
                return res.redirect('/etudiant/changePassword')

            }
        }else{

            req.flash('error' , 'Votre mot de passe est invalide')
            return res.redirect('/etudiant/changePassword')
        }

    }catch(error){

        console.log(error);
    }
}





exports.resetPassForm = (req, res) => {

    return res.render('etudiant/resetPassForm')
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
            return res.render('etudiant/verificationToken' , {email})

        }else{

            req.flash('error' , `Cet adresse Email n'existe pas`)
            return res.redirect('/etudiant/resetPass/form')
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

        return res.render('etudiant/formNewPass' , {email})

        }else{

           let error = "Code invalide"
           return res.render('etudiant/verificationToken' , {email , error})

        }

    }catch(error){

        console.log(error);
    }
}




exports.choisirOption = async(req , res) => {

    const [FiliereId , SemestreId , UtilisateurId , OptionId] = [req.params.FiliereId , req.params.SemestreId , req.params.UtilisateurId , req.params.OptionId]

    try{

        let data = await Etudiant.findOne({where:{UtilisateurId , FiliereId , SemestreId}})
        data.OptionId = OptionId
        await data.save()
        return res.redirect('/etudiant/home')

    }catch(error){console.log(error)}
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
            return res.redirect('/etudiant/login')

        }else{
            
            let error =  'Veuillez vérifier la confirmation de votre mot de passe'
            return res.render('etudiant/formNewPass' , {email , error})
        }
    }catch(error){

        console.log(error);
    }
}





exports.deconnexion = (req, res) => {
    
    req.logout((error) => {

        if(error){
           console.log(error);
        }else{

            req.flash('success' , 'Vous êtes deconnecté')
            return res.redirect('/etudiant/login')
        }
    })
}





exports.CDTmatiere = async(req , res) => {

    const [FiliereId , SemestreId , OptionId , bigDataEC] = [req.params.FiliereId , req.params.SemestreId , req.params.OptionId , []]
    

    try{

        let UEdata = await UE.findAll({where:{FiliereId , SemestreId , OptionId}})

        for(item of UEdata){

            let dataEC = await EC.findAll({where:{UEId : item.id}})
            bigDataEC.push(dataEC)
        }

        return res.render('etudiant/CDTmatiere' , {bigDataEC})

    }catch(error){console.log(error)}

}





exports.CDTmarque = async (req, res) => {

    const ECId = req.params.ECId

    try{
    let dataEtudiant = await Etudiant.findOne({where:{UtilisateurId : req.user.id}})
    let dataHeure = await Heure.findAll()
    let CDTdata = await CDT.findAll({include : [Heure , EC] , where:{ECId}})
    return res.render('etudiant/CDTform' , {dataHeure , ECId , CDTdata , FiliereId : dataEtudiant.FiliereId , SemestreId : dataEtudiant.SemestreId})

    }catch(error){console.log(error)}
}





exports.CDTpostMarque = async(req, res) => {

    const{ HeureId , etudiant_pass , prof_pass , contenu , ECId , SemestreId , FiliereId} = req.body
    let [user , reste , cumule] = [req.user , undefined , undefined]
    
    try{

        let dataEtudiant = await Etudiant.findOne({include : Utilisateur , where:{UtilisateurId : user.id}})
        let dataProf = await EC.findOne({include : Utilisateur , where:{id : ECId}})
        
        let profValid_pass = bcrypt.compareSync(prof_pass , dataProf.Utilisateur.password)
        let etudiantValid_pass = bcrypt.compareSync(etudiant_pass , dataEtudiant.Utilisateur.password)
        let CDTdata = await CDT.findAll({where:{ECId}})
        let dataHeure = await Heure.findOne({where:{id : HeureId}})
        let dataOperation = await OperationVH.findOne({where:{ECId}})
        

        if(!etudiantValid_pass || !profValid_pass){

            req.flash('error' , `Vérifiez le mot de passe de l'étudiant ou du professeur!`)
            return res.redirect(`/etudiant/CDT/marque/${ECId}`)

        }else{

            reste = dataOperation.VH - dataHeure.diff
            
            if(reste < 0 ){

                reste = 0
                dataOperation.VH = reste
                await dataOperation.save()
                req.flash('error' , 'Vous avez terminé cet cours!')
                return res.redirect(`/etudiant/CDT/marque/${ECId}`)

            }else{

                reste = reste
                dataOperation.VH = reste
                await dataOperation.save()
            }

            CDTdata.length != 0 ? cumule = dataHeure.diff + CDTdata[CDTdata.length -1].cumule : cumule = dataHeure.diff

            let newCDT = CDT.build({

                ECId,
                FiliereId,
                SemestreId,
                HeureId,
                effectif : dataHeure.diff,
                cumule,
                reste,
                rubrique : contenu, 
                validationProf :dataProf.Utilisateur.num_matricule,
                validationDeleg : dataEtudiant.num_matricule
            })

            let prevData = await newCDT.save()
            let profEtatData = await ProfEtat.findOne({where:{ECId}})
            let dataEC = await EC.findOne({where:{id : prevData.ECId}})

            if(profEtatData){

                profEtatData.TotalHeure = prevData.cumule
                profEtatData.Montant = prevData.cumule * 11000
                await profEtatData.save()
                req.flash('success' , 'CDT marqué!')
                return res.redirect(`/etudiant/CDT/marque/${ECId}`)

            }else{

                

                let newProfEtat = ProfEtat.build({
                    FiliereId,
                    SemestreId,
                    UEId : dataEC.UEId,
                    prof_matricule : prevData.validationProf,
                    ECId : prevData.ECId,
                    TotalHeure : prevData.cumule,
                    PU : 11000,
                    Montant : prevData.cumule * 11000
                })

                await newProfEtat.save()
                req.flash('success' , 'CDT marqué!')
                return res.redirect(`/etudiant/CDT/marque/${ECId}`)

            }
        }
        
    }catch(error){console.log(error)}

}







