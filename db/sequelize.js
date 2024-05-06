const Sequelize=require('sequelize');

const sequelize=new Sequelize("dbusers",
   'root',
   '12345',{
    host:'localhost',
    dialect:'mysql'
})

const asyncr=async()=>{
    const sync=await sequelize.sync()
    if (sync) {
      console.log('Sicronizado com sucesso')
    } else {
      console.log('Falhou sicronizar')   
    }
  }
 asyncr()

sequelize.authenticate()
.then(()=>{console.log('Connection has been established successfully.')})
.catch (error=>{console.error('Unable to connect to the database:', error)}) 
 
module.exports=sequelize