exports.formatDate = (obj) =>{

    let mois_liste = ['Janvier' , 'Fevrier' , 'Mars' , 'Avril' , 'Mai' , 'Juin' , 'Juillet' , 'Août' , 'Septembre' , 'Octobre' , 'Novembre' , 'Decembre']
    let dates = new Date(obj.createdAt)
    let mois = mois_liste[dates.getMonth()]
    let annee = dates.getFullYear()
    let dateObject = {month : mois,day : dates.getDate() , years : annee}
    return dateObject
    
    }