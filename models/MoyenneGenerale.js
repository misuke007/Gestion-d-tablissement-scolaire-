
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('MoyenneGenerale' , {

        UtilisateurId : {

            type:datatype.INTEGER,
        },
        
        
        SemestreId : {

            type:datatype.INTEGER,
        },

        OptionId :{

            type:datatype.INTEGER
        },
        

        Moyenne : {

            type:datatype.FLOAT,
        },

    })
}