
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Note' , {


        FiliereId : {

            type:datatype.STRING,
            allowNull : false

        },
        
        
        UtilisateurId : {
            type:datatype.INTEGER , 
        } ,

        SemestreId : {
            type:datatype.INTEGER , 
        } ,

        OptionId :{

            type:datatype.INTEGER
        },

        ECId : {
            type:datatype.INTEGER , 
        },


        UEId : {
            type:datatype.INTEGER , 
        },
        

        note:{

            type:datatype.FLOAT , 
            allowNull : false

        }
        

    })
}