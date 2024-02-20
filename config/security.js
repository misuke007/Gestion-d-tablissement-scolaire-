const { Etudiant , Option } = require("../models")

 exports.ensureAuthenticated = (req ,res , next)=>{

    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('error',`Connectez-vous d'abord`)
        return res.redirect('/admin/login')
    }
}





exports.verifSemestre = async (req, res , next) => {

    const user =  req.user

    try{

        let data = await Etudiant.findOne({where:{UtilisateurId : user.id}})
        let dataOption = await Option.findAll({where:{FiliereId : data.FiliereId}})
        return data.SemestreId == 6 && data.OptionId == 0 ?res.render('admin/FilierechoixOption' , {dataOption , FiliereId : data.FiliereId , SemestreId : data.SemestreId , UtilisateurId : data.UtilisateurId}) : next()
        
    }catch(error){console.log(error)}
}





exports.passEtudiant = (req, res , next) => {

    if(req.user.badge == 'ETUDIANT'){

        next()

    }else{

        req.logout((error) => {

            if(error){
               console.log(error);
            }else{
    
                req.flash('error' , `Connectez-vous en tant qu 'étudiant `)
                return res.redirect('/etudiant/login')
            }
        })
        
    }

}





exports.passUserFinance = (req, res , next) => {

    if(req.user.badge == 'FINANCE'){

        next()

    }else{

        req.logout((error) => {

            if(error){
               console.log(error);
            }else{
    
                req.flash('error' , 'Connectez-vous en tant que Finance')
                return res.redirect('/admin/login')
            }
        })
        
    }
}





exports.passAdminAndFinance = (req , res , next) => {

    if(req.user.badge == 'ADMIN' || req.user.badge == 'FINANCE'){next()}else{

        req.logout((error) => {

            if(error){
               console.log(error);
            }else{
    
                req.flash('error' , 'Vous êtes deconnecté')
                return res.redirect('/admin/login')
            }
        })
    }
}


exports.passUserAdmin= (req, res , next) => {

    if(req.user.badge == 'ADMIN'){
        next()
    }else if(req.user.badge == 'FINANCE'){

       res.redirect('/admin/professeur/liste')

    }else{
        
         req.logout((error) => {

        if(error){
           console.log(error);
        }else{

            req.flash('error' , 'Vous êtes deconnecté')
            return res.redirect('/admin/login')
        }
    })
    }
}