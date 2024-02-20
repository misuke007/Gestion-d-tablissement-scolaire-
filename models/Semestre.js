
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Semestre' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        nom : {

            type:datatype.STRING,
            allowNull : false

        }
    })
}