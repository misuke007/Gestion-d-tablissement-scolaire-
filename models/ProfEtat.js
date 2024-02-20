
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('ProfEtat' , {

        FiliereId : {

            type:datatype.INTEGER,
        },

        SemestreId : {

            type:datatype.INTEGER,
        },

        UEId : {

            type:datatype.INTEGER,
        },

        prof_matricule : {

            type:datatype.STRING
        },


        ECId : {

            type:datatype.INTEGER,
        },


        TotalHeure : {

            type:datatype.INTEGER, 
        },

        PU : {

            type:datatype.INTEGER,
        },

        
        Montant : {

            type: datatype.INTEGER
        }

    
    })
}