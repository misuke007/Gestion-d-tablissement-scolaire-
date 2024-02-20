
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Utilisateur' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } ,
        
        
        num_matricule:{

            type : datatype.STRING,
        }, 

        nom : {

            type:datatype.STRING,
            allowNull : false

        } , 

        prenom : {

            type:datatype.STRING,
            allowNull : false


        } ,

        date_de_naissance : {

            type:datatype.DATE,
            allowNull : true

        }, 

        email : {

            type:datatype.STRING,
            allowNull : false

        } , 

        contact : {

            type:datatype.STRING,
            allowNull : false


        },

        adresse : {

            type:datatype.STRING,
            allowNull : true

        },


        badge : {

            type:datatype.STRING,
            allowNull : false

        },

        photo : {
            type : datatype.STRING,
            allowNull : false
        },

        password : {
            type : datatype.STRING,
            allowNull : false
        },


        resetToken : {

            type : datatype.STRING,
            
        }



        
    })
}