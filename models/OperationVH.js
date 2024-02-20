
module.exports = (sequelize , datatype) => {
    
    return sequelize.define('OperationVH' , {


        ECId : {

            type:datatype.INTEGER,
        },


        SemestreId: {

            type:datatype.INTEGER,
        },
        
        
        VH : {
            type:datatype.INTEGER , 
        } ,
    })
}