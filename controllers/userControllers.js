const { where } = require('sequelize');
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const secretKey='fgdikhfrnyruhubbfdbfdseq'

const  register=async(req, res) => {
   try {
   const {name,email,password}= req.body;
   console.log(`Nome: ${name}, Email: ${email}, Password: ${password}`);
   const existingUser = await User.findOne({where:{ email }});
   if (existingUser) {
    console.log('O email ja esta em uso');
   }
   const hashedPassword = await bcrypt.hash(password, 10);  
   const newUser =await User.create({
       name: name,
       email: email,
       password: hashedPassword,
       createdAt: new Date(),
       });
  if (newUser) {
    res.json({ message: 'Usuário cadastrado com sucesso' });
    console.log('Usuário cadastrado com sucesso');
  }
   
   } catch (error) {
    res.status(400).json({ error: error.message });
    console.log('Tente usar o outro email este ja esta em uso: '+error);
    }
   
 }

     
const login=async(req,res)=>{ 
    try { 
const {email,password}=req.body 
const findUser= async ()=>{
if (!email && !password) { 
    return res.status(400).json({message:'Email e password sao obrigatorios'})
    }
const user= await User.findOne({ where:{ email}})
const hashcompare=await bcrypt.compare(password, user.password)   
 if (hashcompare) {    
  console.log('O login foi feito com sucesso'); 
}else{  
  console.log('O password e errado ');
  return res.status(400).json({message:'Email ou password sao errados'})                        
}  
if (user && hashcompare) {
const token=await jwt.sign({email},secretKey,{expiresIn:'1h'});   
    res.json({token}); 
    console.log(token);
    console.log("O usuario foi encontrado com sucesso:  "+email)  
} else{    
    console.log(`Nao foi possivel encontrar o usuario:  `)  
    }   
}
findUser()
} catch (error) {  
  console.log('Erro: '+error);
   }         
}

const senderMessageService=(req,res)=>{
  res.status(200).json({message:'Mensagem recebida com sucesso'})
  try {
    const {name,email,subject}=req.body
    if (!name ||!email||!subject) {
      console.log('E obrigatorio preencher com dados  corretos');
    }
    console.log(`Nome: ${name}, Email: ${email}, Assunto :${subject }`);
  } catch (error) {
   console.log(error); 
  }

}
      
module.exports={ 
  register,
  login,
  senderMessageService
} 