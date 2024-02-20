
let nombreAleatoire = () => {

    let nb = Math.floor(Math.random() * 1000000 ) 
    if(nb < 99999)
        nb *=10
        return nb
}





exports.gPassword = (name) => {

 let subName = name.substring(0,3)
 let password = `${subName}${nombreAleatoire()}`

 return password
}

