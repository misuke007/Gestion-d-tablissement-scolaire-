
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Heure' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        valeur : {

            type:datatype.STRING,
            allowNull : false
        }, 

        diff : {

            type : datatype.INTEGER,
            allowNUll : false
        }
    })
}