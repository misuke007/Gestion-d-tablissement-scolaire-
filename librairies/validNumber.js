exports.validNumber = (string) => {

    let [number , sufix ,prefix] = [string , undefined , undefined]
    let defaultSufix = ['32' ,'33' ,'34','38','032','033','034','038','+261']
        while(number.includes(' ')){
            number = number.replace(' ','')
        }
      switch(number.length){
          case 9:
              sufix = number.substring(0,2)
              prefix = number
              break
          case 10:
              sufix = number.substring(0,3)
              prefix = number.substring(1)
              break
          case 13:
              sufix = number.substring(0,4)
              prefix = number.substring(4)
              break
        default:
            return false
      }  
      return defaultSufix.includes(sufix) ? `+261${prefix}` : false
    }
