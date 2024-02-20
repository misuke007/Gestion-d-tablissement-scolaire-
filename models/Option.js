
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('Option' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        nom : {

            type:datatype.STRING,
            allowNull : false

        },
        
        
        FiliereId : {
            type:datatype.INTEGER , 
        },
        

    })
}