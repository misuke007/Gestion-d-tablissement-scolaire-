
module.exports = (sequelize , datatype) => {

    return sequelize.define('Etudiant' , {

        UtilisateurId:{

            type:datatype.INTEGER,
        },

        num_matricule:{

            type : datatype.STRING,
        }, 


        FiliereId:{

            type:datatype.INTEGER,
        },



        SemestreId:{

            type:datatype.INTEGER,
        },

        OptionId :{

            type:datatype.INTEGER
        },
        

        statut:{

            type:datatype.STRING,
        },

    })
}