const express=require('express')
const cors=require('cors')
const process=require('process')
const routes=require('./routes/routes')
const app=express()
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
  })
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())



app.use('/register',routes)
app.use('/login',routes)
app.use('/subject',routes)



const PORT=process.env.PORT||4000
app.listen(PORT,()=>{console.log( `The server have started on port ${PORT}`);})