const { UE, EC, Utilisateur, Semestre, Filiere, Jour, Heure, ProfEdt, Edt , Etudiant , ProfEtat , OperationVH , CDT , Option} = require('../models')
const { Op , Sequelize } = require('sequelize')
const { moveFile } = require('../librairies/fileUpload')
const { validNumber } = require('../librairies/validNumber')
const { fileName } = require('../librairies/fileName')
const { gPassword } = require('../librairies/generatePassword')
const { verif_heure } = require('../librairies/Verif_heure')
const {date} = require('../librairies/date')
const {formatDate} = require('../librairies/formatDate')
const {generateMatricule} = require('../librairies/generateMatricule')
const moment = require('moment');
const ExcelJS = require('exceljs');
const fileupload = require('fileupload')
const fs = require('fs')
const passport = require("passport")
const bcrypt = require('bcryptjs')
const { log } = require('console')


Filiere.hasMany(UE)
UE.belongsTo(Filiere)
Filiere.hasMany(EC)
EC.belongsTo(Filiere)
Semestre.hasMany(UE)
UE.belongsTo(Semestre)
UE.hasMany(EC)
EC.belongsTo(UE)
Utilisateur.hasMany(EC)
EC.belongsTo(Utilisateur)
Jour.hasMany(ProfEdt)
ProfEdt.belongsTo(Jour)
Heure.hasMany(ProfEdt)
ProfEdt.belongsTo(Heure)
Utilisateur.hasMany(ProfEdt)
ProfEdt.belongsTo(Utilisateur)
EC.hasMany(ProfEdt)
ProfEdt.belongsTo(EC)
Utilisateur.hasMany(Etudiant)
Etudiant.belongsTo(Utilisateur)
Filiere.hasMany(Etudiant)
Etudiant.belongsTo(Filiere)
Semestre.hasMany(Etudiant)
Etudiant.belongsTo(Semestre)
EC.hasMany(ProfEtat)
ProfEtat.belongsTo(EC)
Filiere.hasMany(ProfEtat)
ProfEtat.belongsTo(Filiere)
Semestre.hasMany(ProfEtat)
ProfEtat.belongsTo(Semestre)
UE.hasMany(ProfEtat)
ProfEtat.belongsTo(UE)
Option.hasMany(UE)
UE.belongsTo(Option)
Option.hasMany(Etudiant)
Etudiant.belongsTo(Option)





exports.home = async (req, res) => {

    try {

        const data = await Filiere.findAll()
        const user = req.user
        return res.render('admin/home', {data , user})

    } catch (error) {

        console.log(error);
    }

}





exports.optionAdmin = async(req, res) => {

    const FiliereId = req.params.FiliereId
    
    try{

        let data = await Filiere.findOne({where:{id : FiliereId}})

        const etudiant_L1 = await Etudiant.findAll({where:{[Op.or] : [{SemestreId : 1} ,{SemestreId : 2}]}})
        const etudiant_L2 = await Etudiant.findAll({where:{[Op.or] : [{SemestreId : 3} ,{SemestreId: 4}]}})
        const etudiant_L3 = await Etudiant.findAll({where:{[Op.or] : [{SemestreId : 5} ,{SemestreId : 6}]}})
        const etudiant_M1 = await Etudiant.findAll({where:{[Op.or] : [{SemestreId : 7} ,{SemestreId : 8}]}})
        const etudiant_M2 = await Etudiant.findAll({where:{[Op.or] : [{SemestreId : 9} ,{SemestreId : 10}]}})

        return res.render('admin/optionAdmin', { FiliereId , data ,  etudiant_L1 , etudiant_L2 , etudiant_L3 , etudiant_M1 , etudiant_M2 })

    }catch(error){console.log(error)}
    
}





exports.UEOption = async(req, res) => {

    const FiliereId = req.params.FiliereId

    try{

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}}) 
        return res.render('admin/UEOption', { FiliereId , dataFiliere })

    }catch(error){

        console.log(error)
    }
    
}





exports.UEchoixSem = async(req , res) => {

    const FiliereId = req.params.FiliereId

    try{


        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/UEchoixSem' , {data , FiliereId  , dataFiliere})

    }catch(error){console.log(console.log(error))}
}




exports.UEverifSem = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId

    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10 ){

        try{

            let dataOption = await Option.findAll({where:{FiliereId}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/UEchoixOption' , {dataOption , FiliereId , SemestreId , dataFiliere})

        }catch(error){console.log(error)}

    }else{

        try{

            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/UEAjout' , {OptionId : null , FiliereId , SemestreId , dataFiliere})

        }catch(error){console.log(error)}
    }

}





exports.UEvalidationOp = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId

    try{

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        let dataSemestre  = await Semestre.findOne({where: {id:SemestreId}})
        return res.render('admin/UEAjout' , {FiliereId , OptionId , SemestreId , dataFiliere , dataSemestre})

    }catch(error){

        console.log(error)
    }
}





exports.UEAjout = async (req, res) => {

    try {

        const FiliereId = req.params.FiliereId

        const data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/UEAjout', { FiliereId, data , dataFiliere})


    } catch (error) {

        console.log(error);
    }

}





exports.postUEAjout = async (req, res) => {

    const { nom, SemestreId, FiliereId, OptionId } = req.body

    if (nom != '') {

        let newUE = UE.build({

            nom,
            FiliereId,
            SemestreId,
            OptionId
        })

        await newUE.save()
        req.flash('success', 'Nouveau UE ajouté !')
        res.redirect(`/admin/optionAdmin/UE/liste/${FiliereId}`)

    } else {

        req.flash('error', 'Veuillez remplir les champs vides')
        res.redirect(`/admin/optionAdmin/UE/liste/${FiliereId}`)
    }
}





exports.UEListe = async (req, res) => {

    const FiliereId = req.params.FiliereId

    try {

        const data = await UE.findAll({ include: [Semestre , Option], where: { FiliereId }, order: [['nom', 'ASC']] })
        const dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/UEListe', { data, FiliereId , dataFiliere })

    } catch (error) {

        console.log(error)
    }
}




exports.UEDelete = async (req, res) => {

    const [FiliereId , SemestreId , UEId , OptionId] = [req.params.FiliereId ,req.params.SemestreId , req.params.UEId , req.params.OptionId  ]

   

    try {

        await UE.destroy({
            where: {

                [Op.and]: [

                    { FiliereId },
                    { SemestreId },
                    { id :UEId },
                    { OptionId},


                ]
            }
        })

        req.flash('success', 'Suppression avec succès')
        res.redirect(`/admin/optionAdmin/UE/liste/${FiliereId}`)

    } catch (error) {

        console.log(error);
    }

}





exports.UEUpdate = async (req, res) => {

    let FiliereId = req.params.FiliereId
    let SemestreId = req.params.SemestreId

    try {

        const data = await UE.findOne({
            where: {

                [Op.and]: [

                    { FiliereId },
                    { SemestreId },
                ]
            }
        })

        const semestreData = await Semestre.findAll()


        return res.render('admin/UEUpdate', { data, FiliereId, SemestreId, semestreData })

    } catch (error) {

        console.log(error);
    }

}




exports.postUEUpdate = async (req, res) => {

    const { nom, semestre, FiliereId, SemestreId } = req.body

    if (nom != '') {

        try {

            let majUE = {

                nom,
                SemestreId: semestre
            }

            await UE.update(majUE, {
                where: {

                    [Op.and]: [

                        { FiliereId },
                        { SemestreId },
                    ]
                }
            })

            req.flash('success', 'Modification réussie!')
            res.redirect(`/admin/optionAdmin/UE/liste/${FiliereId}`)



        } catch (error) {

            console.log(error);
        }

    } else {

        req.flash('error', 'Veuillez remplir les champs vides!')
        res.redirect(`/admin/optionAdmin/UE/update/${FiliereId}/${SemestreId}`)
    }
}





exports.UESearch = async (req, res) => {

    const { UEsearch, FiliereId } = req.body

    try {

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        const dataResult = await UE.findAll({
            include: Semestre, where: {

                nom: { [Op.like]: `%${UEsearch}%` },
                [Op.and]: [{ FiliereId }]

            }
        })

        return res.render('admin/UESearch', { dataResult, FiliereId , dataFiliere })

    } catch (error) {

        console.log(error);
    }

}




exports.profForm = (req, res) => {
    const user = req.user
    return res.render('admin/profForm'  , {user})
}





exports.profValideFinance = async (req, res) => {

    const prof_matricule = req.params.matricule
    
    try{

        await ProfEtat.destroy({where:{prof_matricule}})
        req.flash('success' , 'Professeur validé!')
        return res.redirect(`/admin/professeur/voir_etat/${prof_matricule}`)

    }catch(error){console.log(error)}
}






exports.profPostForm = async (req, res) => {


    const { nom, prenom, email, contact } = req.body
    let file = req.files


    if (nom == '' || prenom == '' || email == '' || contact == '' || file == null) {


        req.flash('error', 'Veuillez remplir tous les champs!')
        res.redirect('/admin/professeur/formAjout')

    } else {

        if (validNumber(contact)) {

            try {

                let verif_mail = await Utilisateur.findOne({ where: { email } })

                if (verif_mail) {

                    req.flash('error', 'Cet adresse e-mail est déjà utilisé!')
                    res.redirect('/admin/professeur/formAjout')

                } else {

                    let newfileName = fileName(file)
                    if (moveFile(file, newfileName)) {

                        let pass = gPassword(nom)
                        let hashedPassword = bcrypt.hashSync(pass, 12)
                        // transformer en email
                        req.flash('pass', `${pass}`)

                        try {

                            let newProf = Utilisateur.build({

                                nom,
                                prenom,
                                email,
                                contact: validNumber(contact),
                                badge: 'PROFESSEUR',
                                photo: newfileName,
                                password: hashedPassword

                            })

                            let newProfData = await newProf.save()
                            newProfData.num_matricule = `PROF-${generateMatricule()}${newProfData.id}`
                            await newProfData.save()
                            req.flash('success', `Insertion réussie!`)
                            res.redirect('/admin/professeur/formAjout')


                        } catch (error) {

                            console.log(error);
                        }

                    } else {

                        req.flash('error', 'Erreur de téléchargement de votre photo!')
                        res.redirect('/admin/professeur/formAjout')
                    }
                }

            } catch (error) {

                console.log(error);
            }
        } else {

            req.flash('error', 'Saisissez un numéro Malagasy!')
            res.redirect('/admin/professeur/formAjout')
        }
    }

}





exports.optionProf = (req, res) => {
    
    const user = req.user
    return res.render('admin/optionProf' , {user})
}





exports.profList = async (req, res) => {

  const user = req.user

    try {

        let data = await Utilisateur.findAll({ where: { badge: 'PROFESSEUR' } })
        return res.render('admin/profList', { data , user})

    } catch (error) {

        console.log(error);
    }
}





exports.profVoir = async(req, res) => {

    const id = req.params.id
    const user = req.user

    try{

        let data = await Utilisateur.findOne({where:{id}})

        console.log(id)
        let ECprof = await EC.findAll({where:{UtilisateurId : id}})
        return res.render('admin/profVoir' , {data , user , ECprof})

    }catch(error){console.log(error)}
}





exports.profVoirEtat = async(req , res) => {

    const prof_matricule = req.params.matricule

    try{

        let data = await ProfEtat.findAll({include : [{model : UE, include : [Option]} , EC,Filiere , Semestre] , where:{prof_matricule}})
        const sommeMontant = await ProfEtat.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Montant')), 'total']],
              where:{prof_matricule}
            })
        
        return res.render('admin/profVoirEtat' , {data , prof_matricule , Montant_total : sommeMontant.dataValues.total})
        
    }catch(error){console.log(error)}
}





const profValidationEtat = async(req, res) => {

    const prof_matricule = req.params.matricule
    
    try{

        let dataProf = await Utilisateur.findOne({where:{prof_matricule}})
        await ProfEtat.destroy({where:{prof_matricule}})
        req.flash('success' , ` Validation de ${dataProf.nom} ${dataProf.prenom} réussie!`)
        return res.redirect('/admin/finance/liste_prof')

    }catch(error){console.log(error)}
}





exports.profSupprimer = async (req, res) => {

    let id = req.params.id

    try {


        let data = await Utilisateur.findOne({ where: { id } })
        await Utilisateur.destroy({ where: { id } })

        fs.unlink(`./public/user_profil/${data.photo}`, function (error) {
            if (error) console.log(error);
        })

        req.flash('success', 'Suppression avec succès!')
        res.redirect('/admin/professeur/liste')

    } catch (error) {

        console.log(error);
    }
}





exports.profUpdateform = async (req, res) => {

    const id = req.params.id
    const user = req.user

    try {

        let data = await Utilisateur.findOne({ where: { id } })
        return res.render('admin/profUpdateform', { data, id  , user})

    } catch (error) {

        console.log(error);
    }
}





exports.profPostUpdate = async (req, res) => {

    const id = req.params.id
    const user = req.user

    const { nom, prenom, email, contact } = req.body
    let file = req.files

    if (req.files == null) {

        try {

            let data = { nom, prenom, email, contact }

            await Utilisateur.update(data, { where: { id } })
            req.flash('success', 'Modification terminée!')
            res.redirect(`/admin/professeur/modifier/${id}`)

        } catch (error) {

            console.log(error);
        }

    } else {

        try {

            let dataUser = await Utilisateur.findOne({ where: { id } })

            fs.unlink(`./public/user_profil/${dataUser.photo}`, function (error) {
                if (error) console.log(error);
            })

            let newfileName = fileName(file)
            let data = { nom, prenom, email, contact, photo: newfileName }
            moveFile(file, newfileName)
            await Utilisateur.update(data, { where: { id } })
            req.flash('success', 'Modification terminée!')
            res.redirect(`/admin/professeur/modifier/${id}`)


        } catch (error) {

            console.log(error);
        }
    }

}





exports.profRecherche = async (req, res) => {

    const { search } = req.body
    const user = req.user

    try {

        let dataResult = await Utilisateur.findAll({
            where: {

                [Op.or]: [

                    { nom: { [Op.like]: `%${search}%` } , badge : 'PROFESSEUR'},
                    { prenom: { [Op.like]: `%${search}%` } ,  badge : 'PROFESSEUR'}
                ]
            }
        })

        return res.render('admin/profRecherche', { dataResult  , user})

    } catch (error) {

        console.log(error);
    }
}





exports.ecOption = async (req, res) => {

    let FiliereId = req.params.FiliereId

    try{

        let dataFiliere = await Filiere.findOne({where:{id:FiliereId}})
        return res.render('admin/ecOption', { FiliereId , dataFiliere })
    }catch(error){console.log(error)}
    
}





exports.ecChoixSem = async (req, res) => {

    let FiliereId = req.params.FiliereId

    try {

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/ecChoixSem', { data, FiliereId , dataFiliere })

    } catch (error) {console.log(error);}
}





exports.ecAjoutForm = async (req, res) => {

    let FiliereId = req.params.FiliereId
    let SemestreId = req.params.SemestreId


    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9  || SemestreId == 10){

        try{

            let data = await Option.findAll({where:{FiliereId}})
            let dataFiliere = await Filiere.findOne({where: {id : FiliereId}})
            return res.render('admin/EChoixOption' , {data , FiliereId , SemestreId , dataFiliere})

        }catch(error){console.log(error)}

    }else{

        try {

            let dataFiliere = await Filiere.findOne({where: {id : FiliereId}})
            let data = await UE.findAll({
                where: {
    
                    [Op.and]: [
    
                        { FiliereId },
                        { SemestreId }
                    ]
                }
            })
    
            return res.render('admin/ecAjoutForm', { data, FiliereId, SemestreId , dataFiliere , OptionId : 0 })
    
        } catch (error) {console.log(error)}
    }
}





exports.ecChoixOption = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId


    try{

        let data = await UE.findAll({where:{FiliereId , SemestreId , OptionId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/ecAjoutForm' , {data , FiliereId , SemestreId , dataFiliere , OptionId})

    }catch(error){console.log(error)}

}




exports.ecPostAjout = async (req, res) => {

    const { nom, VH, UEId, FiliereId, SemestreId  , OptionId} = req.body

    if(nom == '' || VH == '' || UEId == ''){

        req.flash('error' , 'Veuillez remplir ous les champs!')
        return OptionId == 0 ? res.redirect(`/admin/ec/ajout/${FiliereId}/${SemestreId}`) : res.redirect(`/admin/ec/ajout/choixOption/${FiliereId}/${SemestreId}/${OptionId}`)

    }else{

        try {

            let newEC = EC.build({ nom, VH, UEId, FiliereId })
            let prevData = await newEC.save()
            let newOperationVH = OperationVH.build({ECId : prevData.id , VH , SemestreId})
            await newOperationVH.save()
            req.flash('success', 'insertion réussie!')
            return OptionId == 0 ? res.redirect(`/admin/ec/ajout/${FiliereId}/${SemestreId}`) : res.redirect(`/admin/ec/ajout/choixOption/${FiliereId}/${SemestreId}/${OptionId}`)
            
        } catch (error) {console.log(error)}

    }

   
}





exports.ecListe = async (req, res) => {

    let FiliereId = req.params.FiliereId


    try {

        let data = await EC.findAll({ include: [{model : UE , include : [Option]}, Utilisateur], where: { FiliereId } })
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/ecListe', { data, FiliereId , dataFiliere })


    } catch (error) {

        console.log(error);
    }
}





exports.ecVoir = async (req, res) => {

    const [id, SemestreId, FiliereId] = [req.params.ECId, req.params.SemestreId, req.params.FiliereId]

    try {

        let data = await EC.findOne({ include: [Utilisateur, UE], where: { [Op.and]: [{ id }, { FiliereId }] } })
        let dataOption = await UE.findOne({include: Option, where:{id : data.UEId , SemestreId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/ecVoir', { data, FiliereId, SemestreId , dataFiliere , dataOption })

    } catch (error) {

        console.log(error);
    }
}





exports.ecEnlevProf = async (req, res) => {

    const [id, FiliereId, SemestreId, UtilisateurId] = [req.params.ECId, req.params.FiliereId, req.params.SemestreId, req.params.UtilisateurId]

    try {

        let data = { UtilisateurId: null }
        await EC.update(data, { where: { [Op.and]: [{ FiliereId }, { id }, { UtilisateurId }] } })
        req.flash('success', 'Retiré avec succès!')
        res.redirect(`/admin/ec/voir/${id}/${SemestreId}/${FiliereId}`)

    } catch (error) {

        console.log(error);
    }

}






exports.ecRecherche = async (req, res) => {

    const { search, FiliereId } = req.body


    if (search != '') {

        try {

            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

            let data = await EC.findAll({
                include: UE, where: {

                    nom: { [Op.like]: `%${search}%` },
                    [Op.and]: [{ FiliereId }]

                }
            })

            return res.render('admin/ecRecherche', { data, FiliereId , dataFiliere })

        } catch(error){console.log(error)}

    }else{

        req.flash('error', `Veuillez entrer le nom d'EC à rechercher `)
        res.redirect(`/admin/ec/liste/${FiliereId}`)

    }


}





exports.ecModifier = async (req, res) => {

    let [id, SemestreId, FiliereId] = [req.params.ECId, req.params.SemestreId, req.params.FiliereId]

    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        try {

        
            let dataEC = await EC.findOne({include : [{model : UE, include : [Option]}], where:{id}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        
            let dataUE = await UE.findAll({

                    where: {
        
                        [Op.and]: [
        
                            { FiliereId },
                            { SemestreId },
                            {OptionId : dataEC.UE.Option.id},
                        ]
                    }
                })

                for(item of dataUE){

                    console.log(item.nom);
                }
            
            return res.render('admin/ecModifier', { dataUE , dataEC, FiliereId , dataFiliere })

        } catch (error) {console.log(error)}

    }else{

        try {

            let dataUE = await UE.findAll({
                where: {
    
                    [Op.and]: [
    
                        { FiliereId },
                        { SemestreId },
                    ]
                }
            })
    
            let dataEC = await EC.findOne({ where: { id } })
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/ecModifier', { dataUE, dataEC, FiliereId , dataFiliere})
    
        } catch (error) {console.log(error)}

    }

    

}





exports.ecPostModif = async (req, res) => {

    const { nom, VH, UEId, ECId, FiliereId } = req.body

    let data = { nom, VH, UEId }

    try {

        await EC.update(data, {
            where: {

                [Op.and]: [

                    { id: ECId },
                    { FiliereId }
                ]
            }
        })

        let dataVH = await OperationVH.findOne({where:{ECId}})
        dataVH.VH = VH
        await dataVH.save()

        req.flash('success', 'Modification terminée!')
        res.redirect(`/admin/ec/liste/${FiliereId}`)

    } catch (error) {

        console.log(error);
    }
}





exports.ecSupprimer = async (req, res) => {

    let [id, FiliereId] = [req.params.ECId, req.params.FiliereId]

    try {

        await EC.destroy({ where: { [Op.and]: [{ id }, { FiliereId }] } })
        req.flash('success', 'EC supprimé avec succès!')
        res.redirect(`/admin/ec/liste/${FiliereId}`)

    } catch (error) {

        console.log(error);
    }
}





exports.profMsem = async (req, res) => {

    let FiliereId = req.params.FiliereId

    try {

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

        return res.render('admin/profMsem', { data, FiliereId , dataFiliere})

    } catch (error) {

        console.log(error);
    }
}






exports.profMattr = async (req, res) => {

    const [FiliereId, SemestreId] = [req.params.FiliereId, req.params.SemestreId]
    let data = []


    if(SemestreId == 6 || SemestreId == 7  || SemestreId == 8  || SemestreId == 9  || SemestreId == 10){

        try{

            let data = await Option.findAll({where:{FiliereId}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/profMatChoixOp' , {data , FiliereId , SemestreId , dataFiliere})

        }catch(error){

            console.log(error)
        }
        

    }else{

        try {

            let dataUE = await UE.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId }] } })
            let dataProf = await Utilisateur.findAll({ where: { badge: 'PROFESSEUR' } })
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
    
            for (item of dataUE) {
    
                let dataEC = await EC.findAll({ where: { [Op.and]: [{ FiliereId }, { UEId: item.id }, { UtilisateurId: null }] } })
                data.push(dataEC)
            }
    
            return res.render('admin/profMattr', { data, dataProf, FiliereId, SemestreId , OptionId : 0 , dataFiliere})
    
        } catch (error) {console.log(error)}
    } 
}





exports.profMattrChoixOp = async(req , res) => {

    const [FiliereId , SemestreId , OptionId , data] = [req.params.FiliereId , req.params.SemestreId , req.params.OptionId , []]


    try{

        let dataUE = await UE.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId} , {OptionId}] } })
        let dataProf = await Utilisateur.findAll({ where: { badge: 'PROFESSEUR' }})
        let dataSemestre  = await Semestre.findOne({where: {id:SemestreId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

        for (item of dataUE) {

            let dataEC = await EC.findAll({ where: { [Op.and]: [{ FiliereId }, { UEId: item.id }, { UtilisateurId: null }] } })
            data.push(dataEC)

        }

        return res.render('admin/profMattr', { data, dataProf, FiliereId, SemestreId , OptionId ,  dataSemestre , dataFiliere})



    }catch(error){console.log(error)}

}





exports.postProfMattr = async (req, res) => {

    const { FiliereId, ECId, UtilisateurId, SemestreId , OptionId } = req.body

    try {

        if (ECId != "") {


            let dataMaj = { UtilisateurId }
            await EC.update(dataMaj, { where: { [Op.and]: [{ FiliereId }, { id: ECId }] } })
            req.flash('success', 'Afféctation réussie!')
            if(OptionId == 0) {res.redirect(`/admin/prof&mat/attribuer/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/prof&mat/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}
            
        } else {

            req.flash('error', `il n'y a pas de matière`)
            if(OptionId == 0) {res.redirect(`/admin/prof&mat/attribuer/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/prof&mat/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}

        }


    } catch (error) {

        console.log(error);
    }




}





exports.edtchoixSem = async (req, res) => {

    const FiliereId = req.params.FiliereId

    try {

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/edtchoixSem', { data, FiliereId , dataFiliere })

    } catch (error) {

        console.log(error);
    }
}





exports.edtFormAjout = async (req, res) => {

let [FiliereId, SemestreId , dataFiliere , dataSemestre] = [req.params.FiliereId, req.params.SemestreId , undefined , undefined]
let bigDataEc = []


    if(SemestreId  == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        try{

        let data = await Option.findAll({where:{FiliereId}})
        dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        dataSemestre  = await Semestre.findOne({where: {id:SemestreId}})
        return res.render('admin/edtOption' , {data , SemestreId , FiliereId , dataFiliere, dataSemestre})

        }catch(error){console.log(error)}

    }else{

        try {

            let dataUE = await UE.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId }] } })
            dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

    
            for (item of dataUE) {
    
                let dataEC = await EC.findAll({ where: {UEId: item.id , UtilisateurId:{[Op.not] : null}}})
                dataSemestre  = await Semestre.findOne({where: {id:SemestreId}})

                if(dataEC.length != 0)bigDataEc.push(dataEC)
            }
    
            let dataDay = await Jour.findAll()
            let dataHeure = await Heure.findAll()
    
            return res.render('admin/edtFormAjout', { bigDataEc, dataDay, dataHeure, FiliereId, SemestreId , OptionId : 0 , dataFiliere , dataSemestre})
    
        }catch(error) {console.log(error)}


    }
}





exports.edtOpFiliere = async(req, res) => {


    const  [FiliereId , SemestreId , OptionId , bigDataEc] = [req.params.FiliereId , req.params.SemestreId , req.params.OptionId , []]

    try {

        let dataUE = await UE.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}] } })
        let dataFiliere = await Filiere.findOne({where : {id : FiliereId}})
        let dataSemestre  = await Semestre.findOne({where: {id:SemestreId}})
        for (item of dataUE) {

            let dataEC = await EC.findAll({ where: {UEId: item.id , UtilisateurId:{[Op.not] : null}}})
            if(dataEC.length != 0)bigDataEc.push(dataEC)
        }

        let dataDay = await Jour.findAll()
        let dataHeure = await Heure.findAll()

        return res.render('admin/edtFormAjout', { bigDataEc, dataDay, dataHeure, FiliereId, SemestreId , OptionId , dataFiliere , dataSemestre})

    }catch(error) {console.log(error)}
}





exports.postEdtFormAjout = async (req, res) => {

    const { FiliereId, SemestreId, HeureId, JourId, UtilisateurId, ECId  , OptionId} = req.body

    if(ECId == ""){

        req.flash('error' , 'Veuillez Selectionner un EC')
        return res.redirect(`/admin/edt/ajout/${FiliereId}/${SemestreId}`)
    }
   

    try {

        let data_verif_heure = await ProfEdt.findOne({ include: [Utilisateur, Heure], where: { [Op.and]: [{ FiliereId }, { SemestreId }, { JourId }, { HeureId } , {OptionId}] } })
        let profId = await EC.findOne({where : {id:ECId}})
        if (data_verif_heure) {

            req.flash(`error`, `Cette heure est déjà occupé par ${data_verif_heure.Utilisateur.nom}  ${data_verif_heure.Utilisateur.prenom}`)
            if(OptionId == 0){res.redirect(`/admin/edt/ajout/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/choixFiliere_option/${FiliereId}/${SemestreId}/${OptionId}`)}
            
        }else{


            let heureNonDispo = verif_heure(HeureId)

            for (let i = 0; i < heureNonDispo.length; i++) {

                let newProfEdt = ProfEdt.build({

                    FiliereId,
                    SemestreId,
                    OptionId,
                    HeureId: heureNonDispo[i],
                    JourId,
                    UtilisateurId :profId.UtilisateurId,
                    ECId
                })

                await newProfEdt.save()

            }

            req.flash('success', 'EDT inséré!')
            if(OptionId == 0){res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/choixFiliere_option/${FiliereId}/${SemestreId}/${OptionId}`)}

        }

    }catch (error) {console.log(error)}


}





exports.edtChoixOption = async (req, res) => {

    const FiliereId = req.params.FiliereId

    try{

    let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
    return res.render('admin/edtChoixOption', { FiliereId , dataFiliere })

    }catch(error){console.log(error)}
    

}





exports.edtSemestreVoir = async (req, res) => {

    let FiliereId = req.params.FiliereId

    try {

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/edtSemestreVoir', { data, FiliereId  , dataFiliere })

    } catch (error) {

        console.log(error);
    }

}





exports.edtVoir = async (req, res) => {

    const [FiliereId, SemestreId] = [req.params.FiliereId, req.params.SemestreId]
    let [jour1, jour2, jour3, jour4, jour5, jourInit, jourCompar , dateEDT , dataFiliere] = [[], [], [], [], [], undefined, undefined , undefined , undefined]

    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        let data = await Option.findAll({where:{FiliereId}})
        dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/edtChoixOp' , {data , FiliereId , SemestreId , dataFiliere})

    }else{

        try {

            let dataEdt = await ProfEdt.findAll({ include: [Jour, Heure, EC], where: { [Op.and]: [{ FiliereId }, { SemestreId }] } })
            let dataSemestre = await Semestre.findOne({id : SemestreId})
            dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            let edtPub = await Edt.findOne({where:{FiliereId , SemestreId}})
            let lundi = dataEdt.filter(value => value.Jour.nom == 'Lundi')
            let mardi = dataEdt.filter(value => value.Jour.nom == 'Mardi')
            let mercredi = dataEdt.filter(value => value.Jour.nom == 'Mercredi')
            let jeudi = dataEdt.filter(value => value.Jour.nom == 'Jeudi')
            let vendredi = dataEdt.filter(value => value.Jour.nom == 'Vendredi')
    
    
            if(edtPub){ dateEDT = date(edtPub)}
    
    
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
    
    
            jour3 = jour3.sort((a , b) => {
    
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
    
            return res.render('admin/edtVoir', { jour1, jour2, jour3, jour4, jour5, FiliereId, SemestreId , dateEDT , OptionId : 0  , dataSemestre , dataFiliere})

        } catch (error) {console.log(error)}
    }
}





exports.edtChoixOp = async(req, res) => {

    const [FiliereId, SemestreId , OptionId] = [req.params.FiliereId, req.params.SemestreId , req.params.OptionId]
    let [jour1, jour2, jour3, jour4, jour5, jourInit, jourCompar , dateEDT] = [[], [], [], [], [], undefined, undefined , undefined]

    try {

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        let dataSemestre = await Semestre.findOne({id : SemestreId})
        let dataEdt = await ProfEdt.findAll({ include: [Jour, Heure, EC], where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}]}})
        let edtPub = await Edt.findOne({where:{FiliereId , SemestreId , OptionId}})
        let lundi = dataEdt.filter(value => value.Jour.nom == 'Lundi')
        let mardi = dataEdt.filter(value => value.Jour.nom == 'Mardi')
        let mercredi = dataEdt.filter(value => value.Jour.nom == 'Mercredi')
        let jeudi = dataEdt.filter(value => value.Jour.nom == 'Jeudi')
        let vendredi = dataEdt.filter(value => value.Jour.nom == 'Vendredi')


        if(edtPub){ dateEDT = date(edtPub)}


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


        jour3 = jour3.sort((a , b) => {

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

        return res.render('admin/edtVoir', { jour1, jour2, jour3, jour4, jour5, FiliereId, SemestreId , dateEDT , OptionId , dataFiliere , dataSemestre})

    } catch (error) {console.log(error)}

}





exports.edtSupprimer = async (req, res) => {

    const [FiliereId, SemestreId, JourId, ECId , OptionId] = [req.params.FiliereId, req.params.SemestreId, req.params.JourId, req.params.ECId ,  req.params.OptionId]



    try {

        await ProfEdt.destroy({
            where: {

                [Op.and]: [

                    { FiliereId },
                    { SemestreId },
                    { ECId },
                    { JourId },

                ]
            }
        })

       if(OptionId == 0){ res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{ res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}

    } catch (error) {

        console.log(error);
    }

}





exports.edtPost = async (req, res) => {

    const { FiliereId, SemestreId,OptionId, date } = req.body

    if (date != '') {

        try {

            let dataEdt = await Edt.findOne({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , { OptionId }] } })

            if (dataEdt) {

                req.flash('error', 'Cet edt est déjà publié!')
               if(OptionId == 0 ){ res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{ res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}

            } else {

                let newEdtPost = Edt.build({

                    FiliereId,
                    SemestreId,
                    OptionId,
                    date
                })

                await newEdtPost.save()
                req.flash('success', 'Emploi du temps  publié!')
                if(OptionId == 0){res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}}

        } catch (error) {console.log(error)}



    } else {

        req.flash('error', 'Veuillez entrer la date pour cet EDT!')
        if(OptionId == 0){res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}


    }


}


exports.edtSupprimerTout = async (req, res) => {

    [FiliereId, SemestreId , OptionId] = [req.params.FiliereId, req.params.SemestreId , req.params.OptionId]

    try {

        let dataEdt1 = await ProfEdt.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}] } })
        let dataEdt2 = await Edt.findAll({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}]}})



        if (dataEdt1.length != 0 && dataEdt2.length != 0) {

            await ProfEdt.destroy({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}] } })
            await Edt.destroy({ where: { [Op.and]: [{ FiliereId }, { SemestreId } , {OptionId}] } })
            req.flash('success', 'Emploi du temps supprimé!')
            if(OptionId == 0){res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}


        } else {

            req.flash('error', ` l'emploi du temps n'est pas encore  publié!`)
            if(OptionId == 0){res.redirect(`/admin/edt/voir/${FiliereId}/${SemestreId}`)}else{res.redirect(`/admin/edt/voir/choix_option/${FiliereId}/${SemestreId}/${OptionId}`)}

        }
    } catch (error) {console.log(error)}
}





exports.etudiantOption = async (req, res) => {

    const FiliereId = req.params.FiliereId

    try{

        let dataFiliere = await Filiere.findOne({where:{id: FiliereId}})
        return res.render('admin/etudiantOption', { FiliereId , dataFiliere })

    }catch(error){

        console.log(error);
    }
  
}





exports.etudiantChoiSemDel = async(req, res) => {

    const FiliereId = req.params.FiliereId

    try{

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/etudiantChoiSemDel' , {data , FiliereId , dataFiliere})
    }catch(error){

        console.log(error);
    }
}





exports.etudiantChoixDel = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    let dataFiliere
    


    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        try{

            let data = await Option.findAll({where:{FiliereId}})
            dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/ChoixOptionDel' , {data , FiliereId , SemestreId , })

        }catch(error){console.log(error)}

    }else{

        try{

            let data = await Etudiant.findAll({include:[Utilisateur , Semestre] , where:{FiliereId , SemestreId}})
            dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

            return res.render('admin/etudiantChoixDel' , {data , FiliereId , SemestreId , OptionId : 0 ,dataFiliere})
    
        }catch(error){console.log(error)}

    }
}





exports.etudiantChoixOpDel = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId

    try{

        let data = await Etudiant.findAll({include:Utilisateur , where:{FiliereId , SemestreId , OptionId}})
        return res.render('admin/etudiantChoixDel' , {data , FiliereId , SemestreId , OptionId})

    }catch(error){console.log(error)}

}





exports.etudiantNominDel = async (req, res) => {


    const [UtilisateurId , FiliereId , SemestreId , OptionId] = [req.params.UtilisateurId , req.params.FiliereId, req.params.SemestreId , req.params.OptionId]


    try{

        let dataUser = await Etudiant.findOne({include : [Utilisateur, Filiere , Semestre , Option] , where:{UtilisateurId}})
        dataUser.statut = 'DELEGUE'
        await dataUser.save()
        OptionId == 0 ? req.flash('success' , `${dataUser.Utilisateur.nom} ${dataUser.Utilisateur.prenom} est nommé délégué pour la filière ${dataUser.Filiere.nom} , ${dataUser.Semestre.nom}`) : req.flash('success' , `${dataUser.Utilisateur.nom} ${dataUser.Utilisateur.prenom} est nommé délégué pour la filière ${dataUser.Filiere.nom} , ${dataUser.Semestre.nom} , Option : ${dataUser.Option.nom}`)
        return res.redirect(`/admin/etudiant/choixSemDel/${FiliereId}/${SemestreId}`)

        
    }catch(error){

        console.log(error);
    }
} 





exports.etudiantEnlevStat = async(req, res) => {

    const [UtilisateurId , FiliereId , SemestreId , OptionId] = [req.params.UtilisateurId , req.params.FiliereId, req.params.SemestreId , req.params.OptionId]
    
    try{

        let dataUser = await Etudiant.findOne({where:{UtilisateurId}})
        dataUser.statut = null
        await dataUser.save()
        return res.redirect(`/admin/etudiant/choixSemDel/${FiliereId}/${SemestreId}`)


    }catch(error){console.log(error)}
}




exports.voirDelegue = async(req , res) => {

    const FiliereId = req.params.FiliereId

    try{

        let data = await Etudiant.findAll({include : [Utilisateur , Semestre , Option] , where:{FiliereId , statut : {[Op.not] : null}}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/voirDelegue' , {data , FiliereId , dataFiliere})

    }catch(error){

        console.log(error);
    }
}





exports.etudiantRechDel = async(req , res) => {

    const {search , FiliereId , SemestreId , OptionId} = req.body
    

    try{

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        let data = await Etudiant.findAll({include : [
            
            {

            model : Utilisateur,
            where:{

                [Op.or] : [

                     { nom : {[Op.like] : `%${search}%`} , badge : 'ETUDIANT'},
                    { prenom : {[Op.like] : `%${search}%`} , badge : 'ETUDIANT'},
              ]}

        }, Filiere,Semestre 
    
    ] , where:{FiliereId , SemestreId , OptionId}})

        return res.render('admin/etudiantRechDel' , {data , FiliereId , SemestreId , dataFiliere})

    }catch(error){console.log(error)}

}





exports.etudiantAjoutChoixSem = async (req, res) => {

    const FiliereId = req.params.FiliereId

    try {

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/etudiantAjoutChoixSem', { data, FiliereId , dataFiliere })

    } catch (error) {

        console.log(error);
    }
}









exports.etudiantFormAjout = async(req, res) => {

    const [FiliereId, SemestreId] = [req.params.FiliereId, req.params.SemestreId]

    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        try{

            let data = await Option.findAll({where:{FiliereId}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/etudiantChoixOp' , {data , FiliereId , SemestreId , dataFiliere})

        }catch(error){console.log(error)}

    }else{

        try{

            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/etudiantFormAjout', { FiliereId, SemestreId , OptionId : 0 , dataFiliere})

        }catch(error){

            console.log(error)
        }
        
    }
    
}






exports.etudiantChoixOp = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId


    try{


        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/etudiantFormAjout' , {FiliereId , SemestreId , OptionId , dataFiliere})

    }catch(error){

        console.log(error)
    }

   

}






exports.etudiantPostAjout = async (req, res) => {

    const { FiliereId, SemestreId, OptionId , nom, prenom, adresse, contact, email, date_de_naissance } = req.body
    let file = req.files

   

    if (nom == '' || prenom == '' || adresse == '' || contact == '' || date_de_naissance == '' || file == null) {

        req.flash('error', 'Veuillez remplir tous les champs')
        return res.redirect(`/admin/etudiant/ajout/${FiliereId}/${SemestreId}`)
    }


    try {

        let mailValid = await Utilisateur.findOne({ where: { email } })
        
        if (mailValid) {

            req.flash('error', 'Cet adresse email est déjà utilisé!')
            return res.redirect(`/admin/etudiant/ajout/${FiliereId}/${SemestreId}`)
        }

    } catch (error) {

        console.log(error);
    }

   

    let newfileName = fileName(file)
    if (moveFile(file, newfileName)) {

        let pass = gPassword(nom)
        let hashedPassword = bcrypt.hashSync(pass, 12)
        // transformer en email
        req.flash('pass', `${pass}`)

        try{

            let newUser = Utilisateur.build({

                nom,
                prenom,
                contact,
                adresse,
                date_de_naissance,
                email,
                password : hashedPassword,
                photo : newfileName,
                badge:'ETUDIANT'

            })

            let etudiant = await newUser.save()
            let dataFiliere = await Filiere.findOne({where:{id:FiliereId}})

            let newEtudiant = Etudiant.build({

                FiliereId,
                SemestreId,
                OptionId,
                UtilisateurId:etudiant.id,
                num_matricule : `${dataFiliere.nom.substring(0,4)}-${generateMatricule()}${etudiant.id}`
            })

           await newEtudiant.save()
           req.flash('success' , 'Données enregistrées avec succès !')
           return res.redirect(`/admin/etudiant/liste/${FiliereId}`)

        }catch(error){

            console.log(error);
        }

    } else {

        req.flash('error', 'Erreur de téléchargement de votre image')
        return res.redirect(`/admin/etudiant/ajout/${FiliereId}/${SemestreId}`)
    }

}





exports.etudiantListe = async(req, res) => {

    const FiliereId = req.params.FiliereId

    try{

        let data = await Etudiant.findAll({ include : [Filiere , Utilisateur , Semestre , Option], where:{FiliereId} , order: [[Utilisateur , 'nom', 'ASC']]})
        let dataFiliere = await Filiere.findOne({where:{id:FiliereId}})
        return res.render('admin/etudiantListe' , {data , FiliereId , dataFiliere}) 

    }catch(error){

        console.log(error);
    }
}





exports.etudiantListeParNiv = async (req , res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId


    try{

        let data = await Etudiant.findAll({ include: [ Utilisateur , Option , Semestre , ] , where:{FiliereId , SemestreId} , order: [[Utilisateur , 'nom', 'ASC']]})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/etudiantListeParNiv' , {data , dataFiliere , FiliereId , SemestreId})

    }catch(error){

        console.log(error)
    }

}   






exports.etudiantRech = async(req , res) => {

    const{ search , FiliereId} = req.body

    try{

         let data = await Etudiant.findAll({include :[{

            model : Utilisateur,
            where:{

                [Op.or]: [
    
                    {[Op.and] : [{ nom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]},
                    {[Op.and] : [{ prenom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]}
                ]
            }
        }, 

        {
            model:Semestre,
            subQuery : false
        }, 

        {
            model:Option,
            subQuery : false
        }, 
    
    ]})

    let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
    return res.render('admin/etudiantRech' , {data , FiliereId , dataFiliere , search})

    }catch(error){

        console.log(error);
    }
}





exports.etudiantRechParSem = async(req, res) => {

     const {search} = req.body 
     const FiliereId = req.params.FiliereId
     const SemestreId = req.params.SemestreId

     try{

        let data = await Etudiant.findAll({include :[{

           model : Utilisateur,
           where:{

               [Op.or]: [
   
                   {[Op.and] : [{ nom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]},
                   {[Op.and] : [{ prenom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]}
               ] 
           }
       }, 

       {
           model:Semestre,
           subQuery : false
       }, 

       {
           model:Option,
           subQuery : false
       }, 
   
   ] , where:{SemestreId}})

   let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
   return res.render('admin/etudiantRech' , {data , FiliereId , dataFiliere})

   }catch(error){

       console.log(error);
   }

}





exports.etudiantVoir = async(req, res) => {

    const [FiliereId , UtilisateurId] = [req.params.FiliereId , req.params.UtilisateurId]

    try{

        let data = await Etudiant.findOne({include: [Utilisateur , Semestre , Filiere ,Option] , where:{[Op.and]:[{FiliereId} , {UtilisateurId}]}})
        data.formatValide = moment(data.Utilisateur.date_de_naissance).locale('fr').format('DD MMMM YYYY');
        let dataSemestre = await Semestre.findAll()
        return res.render('admin/etudiantVoir' , {data , dataSemestre , UtilisateurId , FiliereId , OptionId : data.OptionId})

    }catch(error){

        console.log(error);
    }
}





exports.etudiantFormMaj = async(req, res) => {

    const [FiliereId , UtilisateurId] = [req.params.FiliereId , req.params.UtilisateurId]

    try{

        let data = await Etudiant.findOne({include: [Utilisateur , Semestre] , where:{[Op.and]:[{FiliereId} , {UtilisateurId}]}})
        const dateFromDB = data.Utilisateur.date_de_naissance;
        const isoDate = moment.utc(dateFromDB).format('YYYY-MM-DD');
        const dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/etudiantFormMaj' , {data , FiliereId  , UtilisateurId ,isoDate , dataFiliere })

    }catch(error){

        console.log(error);
    }
}





exports.etudiantPostMaj = async(req, res) => {

    const {FiliereId , UtilisateurId , nom ,prenom , contact , adresse , date_de_naissance , email} = req.body
    let file = req.files

    

    if(file != null){

        try{

            let dataEtudiant = await Utilisateur.findOne({where:{id:UtilisateurId}})

            
            fs.unlink(`./public/user_profil/${dataEtudiant.photo}`, function (error) {
                if (error) console.log(error);
            })

            let newfileName = fileName(file)
            let data = { nom, prenom, email, contact, photo: newfileName , adresse , date_de_naissance }
            moveFile(file, newfileName)
            await Utilisateur.update(data, { where: { id : UtilisateurId } })
            req.flash('success', 'Modification terminée!')
            res.redirect(`/admin/etudiant/liste/${FiliereId}`)


        }catch(error){console.log(error)}
    }else{

        try{

        let data = { nom, prenom, email, contact,  adresse , date_de_naissance }
        await Utilisateur.update(data, { where: { id : UtilisateurId } })
        req.flash('success', 'Modification terminée!')
        res.redirect(`/admin/etudiant/liste/${FiliereId}`)

        }catch(error){

            console.log(error);
        }
    }

}





exports.etudiantSuppr = async(req, res) => {

   const [UtilisateurId , FiliereId] =[req.params.UtilisateurId , req.params.FiliereId]
  

    try{

        let data = await Utilisateur.findOne({where:{id:UtilisateurId}})
        await Utilisateur.destroy({where:{id:UtilisateurId}})
        await Etudiant.destroy({where:{UtilisateurId}})
        fs.unlink(`./public/user_profil/${data.photo}`, function (error) {
                if (error) console.log(error);

        req.flash('success', 'suppression terminée!')
        res.redirect(`/admin/etudiant/liste/${FiliereId}`)

            })


    }catch(error){

        console.log(error);
    }
}





exports.CDTchoixSem = async(req, res) => {

    const FiliereId = req.params.FiliereId
    
    try{

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/CDTchoixSem' , {data , FiliereId , dataFiliere})
    }catch(error){console.log(error)}
}





exports.CDTlisteEC = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    let bigDataEc = []

    if(SemestreId == 6 || SemestreId == 7  || SemestreId == 8  || SemestreId == 9  || SemestreId == 10){

        try{

            let data = await Option.findAll({where:{FiliereId}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/CDTchoixOp' , {data , FiliereId , SemestreId , dataFiliere})

        }catch(error){console.log(error)}

    }else{

        try{

            let dataUE = await UE.findAll({where:{SemestreId , FiliereId}})
            let dataSemestre = await Semestre.findOne({where:{id : SemestreId}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
    
            for(item of dataUE){
    
                let dataEC = await EC.findAll({where:{UEId : item.id}})
                bigDataEc.push(dataEC)
            }
    
            return res.render('admin/CDTlisteEC' , {bigDataEc , FiliereId , SemestreId , dataSemestre , dataFiliere})
    
    
    
        }catch(error){console.log(error)}

    }

    

}


exports.CDTchoixOp = async(req , res) => {

    const [FiliereId , SemestreId , OptionId , bigDataEc ] = [req.params.FiliereId ,req.params.SemestreId , req.params.OptionId , [] ]
    
    try{

        let dataUE = await UE.findAll({where:{SemestreId , FiliereId , OptionId}})
        let dataSemestre = await Semestre.findOne({where:{id : SemestreId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

        for(item of dataUE){

            let dataEC = await EC.findAll({where:{UEId : item.id}})
            bigDataEc.push(dataEC)
        }

        return res.render('admin/CDTlisteEC' , {bigDataEc , FiliereId , SemestreId , dataSemestre , dataFiliere})

    }catch(error){console.log(error)}

}





exports.CDTvoir = async(req , res) => {

    const [FiliereId , SemestreId , ECId] = [req.params.FiliereId , req.params.SemestreId , req.params.ECId ] 

    try{

        let data = await CDT.findAll({include : Heure , where:{ECId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

        return res.render('admin/CDTvoir' , {data , dataFiliere , FiliereId , SemestreId , formaterDate : formatDate})

    }catch(error){console.log(error)}
}





exports.CDTreset = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    let bigDataEc = []

 

    try{

        let dataUE = await UE.findAll({where:{FiliereId , SemestreId}})
    
        for(item of dataUE){
            
            let dataEC = await EC.findAll({where:{UEId: item.id}})
            bigDataEc.push(dataEC)
        }

        for(items of bigDataEc){for(item of items){

            let operationVH = await OperationVH.findOne({where:{ECId : item.id , SemestreId}})
            operationVH.VH = item.VH
            operationVH.save()

        }}

        CDT.destroy({where:{FiliereId , SemestreId}})
        req.flash('success' , `CDT semestre ${SemestreId} réinitialisé`)
        return res.redirect(`/admin/CDT/liste_EC/${FiliereId}/${SemestreId}`)


    }catch(error){console.log(error)}
    
}





exports.importExcel = async(req, res) => {

    const prof_matricule = req.params.matricule
    
    try{

        let dataEtatProf = await ProfEtat.findAll({include : [Filiere , UE,Semestre,EC] , where:{prof_matricule}})
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('EtatPRof')

        worksheet.columns = [

            { header: 'Filiere', key: 'Filiere', width: 15 },
            { header: 'Niveau', key: 'Niveau', width: 20 },
            { header: 'UE', key: 'UE', width: 30 },
            { header: 'EC', key: 'EC', width: 30 },
            { header: 'Professeur', key: 'Professeur', width: 15 },
            { header: 'Total(H)', key: 'TotalH', width: 10 },
            { header: 'PU', key: 'PU', width: 10 },
            { header: 'Montant', key: 'Montant', width: 10 },

          ]

          for ( item of dataEtatProf) {

            worksheet.addRow({

             Filiere : item.Filiere.nom,
             Niveau : item.Semestre.nom,
             UE : item.UE.nom,
             EC : item.EC.nom,
             Professeur : item.prof_matricule,
             TotalH : item.TotalHeure,
             PU : item.PU,
             Montant : item.Montant

            })

          }

          

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')
    await workbook.xlsx.write(res);
    res.end();


    }catch(error){console.log(error)}

}





exports.loginForm = (req, res) => {

    return res.render('admin/loginForm')
}





exports.auth = async(req , res , next) => {

    const {email , password} = req.body


    try{

        let userType = await Utilisateur.findOne({where:{email}})

        if(userType && userType.badge == 'ADMIN'){

            passport.authenticate('local' , {
                successRedirect:'/admin/home',
                failureRedirect:'/admin/login',
                failureFlash:true
            })(req, res, next)

        }else if (userType && userType.badge == 'FINANCE'){

            passport.authenticate('local' , {
                successRedirect:'/admin/professeur/liste',
                failureRedirect:'/admin/login',
                failureFlash:true
            })(req, res, next)

        }else{

            req.flash('error' , 'Adresse email invalide!')
            return res.redirect('/admin/login')
        }

    }catch(error){console.log(error)}

}





exports.ajoutFiliere = (req, res) =>{

    return res.render('admin/ajoutFiliere')
}





exports.postAjoutFiliere = async(req, res) => {

    const {nom} = req.body
    let file = req.files

    let newfileName = fileName(file)

    if (moveFile(file, newfileName)){

        let newFiliere = await Filiere.build({nom,image : newfileName})
        await newFiliere.save()
        req.flash('success' , `Insertion d'une nouvelle filière réussie` )
        return res.redirect('/admin/ajout_filiere')

    }else{

        req.flash('error' , `Une erreur s'est produite lors du téléchagement de votre image!` )
        return res.redirect('/admin/ajout_filiere')
    }
}



exports.deconnexion = (req, res) => {
    
    req.logout((error) => {

        if(error){
           console.log(error);
        }else{

            req.flash('success' , 'Vous êtes deconnecté')
            return res.redirect('/admin/login')
        }
    })
}


