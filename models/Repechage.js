
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Repechage' , {

        FiliereId : {

            type:datatype.INTEGER,
        },

        UtilisateurId : {

            type:datatype.INTEGER,
        },
        
        
        SemestreId : {

            type:datatype.INTEGER,
        },

        OptionId :{

            type:datatype.INTEGER
        },


        ECId : {

            type:datatype.INTEGER,
        },

    })
}