const { UE, EC, Utilisateur, Semestre, Filiere, Jour, Heure, ProfEdt, Edt , Etudiant , Note  , MoyenneUE , Repechage , MoyenneGenerale , Option} = require('../models')
const { Op , Sequelize } = require('sequelize')



UE.hasMany(Note)
Note.belongsTo(UE)
EC.hasMany(Note)
Note.belongsTo(EC)
Utilisateur.hasMany(Repechage)
Repechage.belongsTo(Utilisateur)
EC.hasOne(Repechage)
Repechage.belongsTo(EC)



exports.noteChoixSem = async(req, res) => {

    const FiliereId = req.params.FiliereId

    try{

        let data = await Semestre.findAll()
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        return res.render('admin/noteChoixSem' , {data , FiliereId , dataFiliere})

    }catch(error){

        console.log(error);
    }
}





exports.noteEtudiant = async(req, res) => {

    const [FiliereId , SemestreId] = [req.params.FiliereId , req.params.SemestreId]

    if(SemestreId == 6 || SemestreId == 7 || SemestreId == 8 || SemestreId == 9 || SemestreId == 10){

        try{

            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            let data = await Option.findAll({where:{FiliereId}})
            return res.render('admin/noteEtudiantChoixOp' , {data , FiliereId , SemestreId , dataFiliere})
            
        }catch(error){console.log(error)}
      

    }else{

        try{
           
            let data = await Etudiant.findAll({include : [Utilisateur , Semestre] , where:{[Op.and] : [{FiliereId} , {SemestreId} , {OptionId : 0}]}})
            let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
            return res.render('admin/noteEtudiant' , {data , FiliereId , SemestreId , OptionId : 0 , dataFiliere})
    
        }catch(error){
    
            console.log(error);
        }

    }
}





exports.noteChoixOp = async(req, res) => {

    const FiliereId = req.params.FiliereId
    const SemestreId = req.params.SemestreId
    const OptionId = req.params.OptionId


    try{

        let data = await Etudiant.findAll({ include : [Utilisateur , Option , Semestre] , where:{FiliereId , SemestreId , OptionId}})
        let dataFiliere = await Filiere.findOne({where:{ id : FiliereId}})
        return res.render('admin/noteEtudiant' , {data , FiliereId , SemestreId , OptionId , dataFiliere})

    }catch(error){console.log(error)}

}




exports.noteFormAjout = async(req , res) => {

    const [FiliereId , SemestreId , UtilisateurId , OptionId] = [req.params.FiliereId , req.params.SemestreId , req.params.UtilisateurId , req.params.OptionId]
    let data = []

    try{

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        let dataUE = await UE.findAll({where:{[Op.and] : [{FiliereId} , {SemestreId} , {OptionId}]}})
        let dataEtudiant = await Etudiant.findOne({include : Utilisateur , where:{FiliereId , SemestreId  ,UtilisateurId , OptionId}})

        for(item of dataUE){

            let dataEC = await EC.findAll({include : UE , where:{UEId : item.id}})
            data.push(dataEC)   
        }
        
        return res.render('admin/noteFormAjout' , {data , SemestreId , FiliereId , UtilisateurId , OptionId , dataFiliere , dataEtudiant})

    }catch(error){

        console.log(error);
    }
    
}





exports.notePost = async( req, res) => {
    
    let {FiliereId , SemestreId , UtilisateurId ,OptionId, note, ECId , UEId} = req.body
    note = note.filter(value => {if(value != '') return value})
    let bigData = []
    // i stokena id anle UE mba tsy iverimberina
    let dataUEId = []
    // ho asiana anle ue sy ny moyenne any
    let obj = {}
    let moyenne = 0
    dataUEId[0] = UEId[0]
    // tableau pour les EC à repêcher
    let list_repeche = []
    let uniqId = new Map()

    for(item of UEId) if(dataUEId[dataUEId.length - 1] != item ){dataUEId.push(item)}

    if(ECId.length != note.length){

        req.flash('error' , 'Veuillez remplir tous les champs!')
        return res.redirect(`/admin/note/ajout/${FiliereId}/${SemestreId}/${UtilisateurId}/${OptionId}`)

    }else{

        try{

        let data = await Note.findAll({where:{UtilisateurId , SemestreId , FiliereId , OptionId}})
        // let repechage = await Repechage.findAll({where:{UtilisateurId , FiliereId}})

        // Suppression des moyennes et notes  si l'étudiant n'a pas une moyenne generale sup à 10 pour les nouvelles (notes et moyennes)
        if(data){

            await Note.destroy({where:{UtilisateurId , SemestreId , FiliereId}})
            await MoyenneUE.destroy({where:{UtilisateurId , SemestreId}})
            await MoyenneGenerale.destroy({where:{UtilisateurId , SemestreId}})
        }

        // vérification des repêchages 



            // insertion note 

           for(let i = 0 ; i < ECId.length ; i++){

            let newNote = Note.build({

                FiliereId,
                SemestreId,
                UtilisateurId,
                OptionId,
                ECId : ECId[i],
                UEId : UEId[i],
                note : note[i]
            })

            await newNote.save()

           }


           for(item of dataUEId){

            let data = await Note.findAll({include : UE , where:{

                [Op.and] : [
    
                    {FiliereId},
                    {SemestreId},
                    {UtilisateurId},
                    {OptionId},
                    {UEId : item}
                ]
               }})


               for(items of data){

                moyenne = moyenne + items.note;

               }
               
             
               for(a of data){

                let Moyenne = moyenne/data.length
                let res = Moyenne.toFixed(2)
                obj = {UEId : a.UE.id , UE : a.UE.nom , moyenne : res}
                bigData.push(obj)

               }
               
               moyenne = 0
           }

        //    verification s'il y a deux objets identiques dans le bigData

           const trueData = bigData.filter(objet => {
            if (!uniqId.has(objet.UE)) {
                uniqId.set(objet.UE, true);
              return true;
            }
            return false;
          });


          for(item of trueData){

            let newMoyenneUE = MoyenneUE.build({

                UtilisateurId , 
                SemestreId,
                OptionId,
                UEId : item.UEId,
                Moyenne : item.moyenne

              })

              await newMoyenneUE.save()
          }


           // voir de plus pret tous les code 

        const moyenneG = await MoyenneUE.findOne({
            attributes: [
              [Sequelize.fn('AVG', Sequelize.col('Moyenne')), 'moyenne']
            ],
            where: {UtilisateurId , SemestreId , OptionId}
          });


        //   insertion moyenne  générale dans la bdd

        let newMoyenneG = await MoyenneGenerale.build({

            UtilisateurId,
            SemestreId,
            OptionId,
            Moyenne : moyenneG.dataValues.moyenne

        })

        let prevDataM = await newMoyenneG.save()

        if(prevDataM.Moyenne >= 10){

        //   selection des ue qui ont une moyenne inférieur à 10

        let dataMoyenneUE = await MoyenneUE.findAll({where:{

            Moyenne: {[Op.lt]: 10},
            UtilisateurId,
            SemestreId,
            OptionId,

        }})

        // selection des EC qui ont une moyenne inférieur à 10 à partir de l'id des UE inférieur à 10

        for(item of dataMoyenneUE){

            let data = await Note.findAll({ include : EC , where:{

                note: {[Op.lt]: 10},
                UtilisateurId,
                SemestreId,
                OptionId,
                UEId : item.UEId

            }})

            list_repeche.push(data)
        }

     
        for(items of list_repeche){for (item of items){

            let newRepech = Repechage.build({

                FiliereId,
                UtilisateurId,
                SemestreId,
                OptionId,
                ECId: item.EC.id
            })

            await newRepech.save()  
        }}

        }

        // admission en semestre sup si moyenne >= 10


        let dataMoyenneG = await MoyenneGenerale.findOne({where:{SemestreId , UtilisateurId , OptionId, }})

        if(dataMoyenneG.Moyenne >= 10){

            let majSemestre = {SemestreId : parseInt(SemestreId) + 1}
            await Etudiant.update(majSemestre , {where:{UtilisateurId , SemestreId , OptionId}})
        }
        
        req.flash('success' , 'Notes enregistrées avec succès ')
        return OptionId == 0 ? res.redirect(`/admin/note/etudiant/${FiliereId}/${SemestreId}`) : res.redirect(`/admin/note/option_etudiant/${FiliereId}/${SemestreId}/${OptionId}`)

        }catch(error){

            console.log(error);
        }
    }

}





exports.etudiantNoteRech = async(req, res) => {

    
    const{search , FiliereId , SemestreId , OptionId} = req.body

    console.log(search , FiliereId , SemestreId , OptionId);
    

    try{

        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
        let data = await Etudiant.findAll({include :[
        
        {

            model : Utilisateur,
            where:{
                [Op.or]: [
    
                    {[Op.and] : [{ nom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]},
                    {[Op.and] : [{ prenom: { [Op.like]: `%${search}%` } },{badge:'ETUDIANT'}]}
                ]}

        },Semestre , Option
         
        // {
        //     // model:Semestre,
          
        //     model: Filiere,
        //     where: {id: FiliereId,},
        // },

        // {
        //     model: Semestre,
        //     where: {id: SemestreId},
        // },
    
    ] , where:{FiliereId, SemestreId,OptionId}})

        return res.render('admin/etudiantRech' , {data , FiliereId , SemestreId , dataFiliere})

    }catch(error){

        console.log(error);
    }
}





exports.noteVoir = async(req, res) => {

    const [FiliereId , SemestreId , UtilisateurId , OptionId] = [req.params.FiliereId , req.params.SemestreId , req.params.UtilisateurId , req.params.OptionId]
    let uniqId = new Map()
    let bigData =  []

     try{

        let data = await Note.findAll({include : UE , where:{FiliereId , SemestreId , UtilisateurId , OptionId}})
        let dataMoyenneUE = await MoyenneUE.findAll({ where:{SemestreId , UtilisateurId , OptionId}})
        let dataMoyenneG = await MoyenneGenerale.findOne({where:{UtilisateurId , SemestreId , OptionId}})
        let dataRepech = await Repechage.findAll({ include : EC , where:{UtilisateurId , SemestreId , OptionId}})
        let dataEtudiant  = await Etudiant.findOne({include : [Semestre , Utilisateur] , where:{UtilisateurId , FiliereId , OptionId}})
        let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})

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

                    let dataNote = await Note.findAll({include : [UE,EC] , where:{FiliereId , UtilisateurId , UEId : item.UEId , OptionId}})
                    bigData.push(dataNote)
                 }
                    return res.render('admin/noteVoir' , {bigData , UElistId , dataMoyenneUE , dataMoyenneG , dataRepech , SemestreId , dataEtudiant , FiliereId  , UtilisateurId , OptionId , dataFiliere})

    }catch(error){

        console.log(error);
     }
}





exports.noteRepech = async(req, res) => {

const [FiliereId , UtilisateurId, SemestreId , OptionId] = [req.params.FiliereId , req.params.UtilisateurId , req.params.SemestreId , req.params.OptionId]

try{

    let dataRepech = await Repechage.findAll({include:EC , where:{FiliereId , UtilisateurId, SemestreId , OptionId}})
    let dataFiliere = await Filiere.findOne({where:{id : FiliereId}})
    return res.render('admin/noteRepech' ,{FiliereId , UtilisateurId, SemestreId , dataRepech , OptionId , dataFiliere})

}catch(error){

    console.log(error);
}
}





exports.notePostRepech = async(req , res) => {

    let {FiliereId , UtilisateurId, SemestreId , OptionId , note , ECId} = req.body
    // tableau pour stocker les id UE , notes , si le type par défaut   de celles-ci ne sont pas un tableau  
    let [UEId,notes ,idEC] = [[],[],[]]
    
    // tsy maj le note raha vao ec ray sisa no ao amn repechage.

    try{

        if(typeof(ECId) == 'object'){

            for(let i = 0 ; i < ECId.length ; i++){
            let data = await EC.findOne({where:{FiliereId , id : ECId[i]}})
            UEId.push(data.UEId)
            notes.push(note[i])
            idEC.push(data.id)

            }

             UEId = [...new Set(UEId)];

        }else{

            let data = await EC.findOne({where:{FiliereId , id : ECId}})
            UEId.push(data.UEId)
            notes.push(note)
            idEC.push(ECId)
        }

        
        for(let i = 0 ; i < notes.length ; i++){

            if(notes[i] >= 10){
            let data = {note : notes[i]}
            await Note.update(data , {where:{UtilisateurId , SemestreId , OptionId , ECId : idEC[i]}})
            await Repechage.destroy({where:{FiliereId,UtilisateurId , SemestreId , OptionId ,  ECId : idEC[i]}})

            }
        }

        
        for(item of UEId){

            let moyenneUE = await Note.findOne({

            attributes: [
                  [Sequelize.fn('AVG', Sequelize.col('note')), 'moyenneUE']],
                  where: { FiliereId , SemestreId , UtilisateurId , OptionId , UEId : item}
            
            });

              let dataMoyenne = {Moyenne : moyenneUE.dataValues.moyenneUE }
              await MoyenneUE.update(dataMoyenne , {where:{UtilisateurId , SemestreId , OptionId ,  UEId : item}})
        }

            let  moyenneG = await MoyenneUE.findOne({
            attributes: [
              [Sequelize.fn('AVG', Sequelize.col('Moyenne')), 'moyenne']
            ],
            where: {UtilisateurId , SemestreId , OptionId}
          });

          let majMoyenneG = {Moyenne : moyenneG.dataValues.moyenne}
          await MoyenneGenerale.update(majMoyenneG , {where:{UtilisateurId , SemestreId , OptionId}})
          req.flash('success' , 'Mise à jour réussie!')
          return res.redirect(`/admin/note/voir/${FiliereId}/${UtilisateurId}/${SemestreId}/${OptionId}`)


    }catch(error){

        console.log(error);
    }
}

