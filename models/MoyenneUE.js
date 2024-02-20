
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('MoyenneUE' , {


        UtilisateurId : {

            type:datatype.INTEGER,
        },
        
        
        SemestreId : {

            type:datatype.INTEGER,
        },

        OptionId :{

            type:datatype.INTEGER
        },


        UEId : {

            type:datatype.INTEGER,
        },

        Moyenne : {

            type:datatype.FLOAT,
        },

    })
}