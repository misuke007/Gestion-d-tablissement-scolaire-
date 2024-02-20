
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Jour' , {

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