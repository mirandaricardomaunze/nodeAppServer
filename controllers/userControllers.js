const { where } = require('sequelize');
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const secretKey='fgdikhfrnyruhubbfdbfdseq'
const nodemailer=require('nodemailer')

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
  const {name,email,subject}=req.body
  try {
    if (!name ||!email||!subject) {
      console.log('E obrigatorio preencher com dados  corretos');
    }
    console.log(`Nome: ${name}, Email: ${email}, Assunto :${subject }`);
  } catch (error) {
   console.log(error); 
  }
  const transporter=nodemailer.createTransport({
    service:'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth:{
      user:'mirandadeveloper22@gmail.com',
      pass:'ioljcqywcagmnxdy'
    }
  })
  const mailOptions={
    from:'mirandadeveloper22@gmail.com',
    to:email,
    subject:'Cliente. ',
    html:`
    <p>Saudacoes Calorosas <p>
    <p>${subject}<p>
    <p>Meu email: ${email}<p>
    <p>Antenciosamente, ${name} <p>
    ` 
  }

  transporter.sendMail(mailOptions,
    (error,info)=>{
      if (error) {
        console.log(`Erro ao enviar email: ${error}`);
      }else{
        console.log(`Email enviado: ${info.response}`);
      }
    }
  )

}

const resetPassword=async(req,res)=>{
  const {email}=req.body
  res.status(200).json({message:'Rota de nova senha'})
  try {
    const user=await User.findOne({email})
    if (user) {
      console.log('Usuario encontrado');
    }else{
      console.log('Usuario nao encontrado');
    }

    const token=jwt.sign({userId:user._id},secretKey,{expiresIn:'1h'})

    const transporter=nodemailer.createTransport({
      service:'Gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure:true,
      auth:{
        user:'mirandadeveloper22@gmail.com',
        pass:'ioljcqywcagmnxdy'
      }
    })

    const mailOptions={
      from:'mirandadeveloper22@gmail.com',
      to:email,
      subject:'Recuperacao de senha. ',
      html:`
      <p>OLa ${user.email}<p>
      <p>
        Voce solicitou a recuperacao da senha. Clique no link abaixo 
        para redefenir a sua senha 
      <p>
      <p> 
        <a href='http://localhost:3000/NewPassword/${token}>Redefinir Senha<a>
      <p>
      <p>
        Se voce nao solicitou essa recuperacao, ignore este email.
      <p>` 
    }

  transporter.sendMail(mailOptions,
    (error,info)=>{
      if (error) {
        console.log(`Erro ao enviar email: ${error}`);
      }else{
        console.log(`Email enviado: ${info.response}`);
      }
    }
  )
  } catch (error) {
    console.log(`Erro interno do servidor  ${error}`);
  }
}


const newPassword=async(req,res)=>{
const token=req.params
const newpassword=req.body
try {
  const decodedToken=jwt.verify(token,secretKey);
  const userId=decodedToken.userId;
  const user=User.finById(userId);
  if (user) {
    console.log('O usaurio encontrado');
  } else {
    console.log('Usuario nao encontrado');
  }

  const passwordHashed=bcrypt.hash(newpassword,10)
    user.password = passwordHashed;
   await user.save()
} catch (error) {
  
}
}

      
module.exports={ 
  register,
  login,
  senderMessageService,
  resetPassword,
  newPassword
} 