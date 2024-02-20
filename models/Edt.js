module.exports = (sequelize , datatype) =>{

    return sequelize.define('Edt' , {

        FiliereId :{

            type:datatype.INTEGER,
        },

        SemestreId :{

            type:datatype.INTEGER,
        },

        OptionId :{

            type:datatype.INTEGER,
        },
        
        date :{

            type:datatype.DATE,
        }



    })
}