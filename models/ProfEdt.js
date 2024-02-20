
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('ProfEdt' , {


        FiliereId : {

            type:datatype.INTEGER,
        },

        SemestreId : {

            type:datatype.INTEGER,
        },

        OptionId : {

            type:datatype.INTEGER,
        },

        UtilisateurId : {

            type:datatype.INTEGER,
        },

        ECId : {

            type:datatype.INTEGER,
        },

        JourId : {

            type:datatype.INTEGER,
        },

        HeureId : {

            type:datatype.INTEGER,
        },
    })
}