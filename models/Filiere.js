
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Filiere' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        nom : {

            type:datatype.STRING,
            allowNull : false
        },


        image: {

            type:datatype.STRING,
            allowNull : false
        },
    })
}