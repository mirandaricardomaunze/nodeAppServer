const {DataTypes}=require('sequelize')
const sequelize=require('../db/sequelize')


const User = sequelize.define('User', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
       allowNull:false,
       unique:true
    },
    password: {
        type: DataTypes.STRING,
         allowNull:false
      },
   reseToken: {
         type: DataTypes.STRING
       },
   resetTokenExpiry: {
         type: DataTypes.DATE
       }
  });
 

sequelize.authenticate()
    .then(()=>{console.log('Connection has been established successfully.')})
    .catch (error=>{console.error('Unable to connect to the database:', error)}) 
 
module.exports=User;