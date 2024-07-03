const express=require('express')
const cors=require('cors')
const process=require('process')
const session=require('express-session')
const routes=require('./routes/routes')
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.use('/', routes)
app.use('*', routes) 

app.use(session({
  secret:'Secret',
  resave:false,
  saveUninitialized:true
}))



const PORT=process.env.PORT||4000
app.listen(PORT,()=>{console.log( `The server have started on port ${PORT}`);})