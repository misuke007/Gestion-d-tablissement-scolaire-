
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('EC' , {

        id:{

            type : datatype.INTEGER,
            autoIncrement : true ,
            primaryKey : true
        } , 

        nom : {

            type:datatype.STRING,
            allowNull : false

        },
        
        
        VH : {

            type:datatype.INTEGER , 
            allowNull : false
        },
        

    })
}