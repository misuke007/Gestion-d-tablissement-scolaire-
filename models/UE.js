
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('UE' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        nom : {

            type:datatype.STRING,
            allowNull : false
        },


        OptionId : {

            type:datatype.INTEGER,
        },


    })
}