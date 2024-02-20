exports.verif_heure = (heure) => {

    let data = []
    heure  = parseInt(heure)

    switch(heure){

        case 1 :
            data = [4,3,2,1]
            break
        
        case 2 : 
            data = [4,3,1,6,5,2]
            break
        
        case 3 : 
            data = [4,3,1,6,5,3]
            break
          
        case 4 : 
            data = [2,3,1,6,5,4]
            break

            
        case 5 : 
            data = [2,3,4,6,5]
            break

            
        case 6 : 
            data = [2,3,4,5,6]
            break 

        case 7 : 
            data = [8,7]
            break
            
            
        case 8 : 
            data = [7,9,8]
            break

         case 9 : 
            data = [8,9]
            break            
            
    }

 return data
}