exports.date = (obj) =>{

let mois_liste = ['Janvier' , 'Fevrier' , 'Mars' , 'Avril' , 'Mai' , 'Juin' , 'Juillet' , 'Août' , 'Septembre' , 'Octobre' , 'Novembre' , 'Decembre']
let dates = new Date(obj.date)
let mois = mois_liste[dates.getMonth()]
let dateObject = {month : mois,day : dates.getDate()}
return dateObject

}