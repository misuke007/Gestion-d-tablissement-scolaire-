
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('CDT' , {

    
       
        FiliereId: {

            type:datatype.INTEGER 
        },

        
        SemestreId: {

            type:datatype.INTEGER 
        },

        OptionId: {

            type:datatype.INTEGER 
        },
        
        

        ECId: {

            type:datatype.INTEGER 
        },
        



        HeureId : {
            type:datatype.INTEGER 
        },

        effectif : {
            type:datatype.INTEGER ,
            allowNull : false,
        },


        cumule : {
            
            type:datatype.INTEGER ,
            allowNull : false,
        },
       

        reste : {
            type:datatype.INTEGER
        },

        rubrique : {
            type:datatype.STRING 
        },

        validationProf : {

            type:datatype.STRING,
            allowNull : false,
            
        } , 

        validationDeleg : {

            type:datatype.STRING,
            allowNull : false,
        }

    })
}