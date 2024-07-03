const { where, Sequelize } = require('sequelize');
const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const secretKey='fgdikhfrnyruhubbfdbfdseq'
const nodemailer=require('nodemailer')

const  register=async(req, res) => {
   try {
const {name,email,password}= req.body;
const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
if (!passwordRegex.test(password) && password.length>0) {
  res.status(400).json({message:'A senha deve pelo menos ter 8 caracteres, incluindo letras maisuculas,minusculas e numeros !'})
  return
}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email) && email.length>0) {
  res.status(400).json({message:'O email deve ser valido !'})
}


   if (!email && !name && !password) {
    res.status(400).json({message:'E obrigatorio preencher os campos com dados !'})
    console.log('E obrigatorio preencher os campos com dados ');
    return 
   }
   console.log(`Nome: ${name}, Email: ${email}, Password: ${password}`);
   const existingUser = await User.findOne({where:{ email }});
   if (existingUser) { 
      res.status(404).json({message:'O email esta em uso, por favor tente outro !'})
      console.log('O email ja esta em uso');
      return
   }
   
   const hashedPassword = await bcrypt.hash(password, 10);  
   const newUser =await User.create({
       name: name, 
       email: email,
       password: hashedPassword,
       createdAt: new Date(),
       });
  if (newUser) {
    res.json({message: 'Usuário cadastrado com sucesso' });
    console.log('Usuário cadastrado com sucesso');
    return
  }
   
   } catch (error) { 
    console.log('Tente usar o outro email este ja esta em uso: '+error);
    return
    }

 }

     
const login=async(req,res)=>{ 
    try { 
const {email,password}=req.body 

const findUser= async ()=>{

const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
if (!passwordRegex.test(password) && password.length>0) {
  res.status(400).json({message:'A senha deve pelo menos ter 8 caracteres, incluindo letras maisuculas,minusculas e numeros !'})
  return
}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email) && email.length>0) {
  res.status(400).json({message:'O email deve ser valido !'})
}

if (!email && !password ) { 
    res.status(400).json({message:'Email e password sao obrigatorios !'})
    return
}
const user= await User.findOne({ where:{ email}})
const hashcompare=await bcrypt.compare(password, user.password)   
 if (hashcompare) {    
  console.log('O login foi feito com sucesso');
}else{  
  console.log('O password e errado ');
 res.status(404).json({message:'Email ou password sao errados !'})   
 return                     
}  
if (user && hashcompare) {
const token=await jwt.sign({email},secretKey,{expiresIn:'1h'});   
    res.status(200).json({token,message:'Efectuaste login com sucesso'}); 
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

const logout= async(req,res)=>{
 try {
   const {email}=req.body
   if (!email) {
     res.status(400).json({message:'E obrigatorio o email'})
   }
   const user=await User.findOne({where:{email}})
   if (user) {
    console.log('Usuario encontrado !');
   }
   const deleteUser=await User.delete({where:{email}})
    if (deleteUser) {
      console.log('Usuario excluido com sucesso!');
    }
 } catch (error) {
  
 }

}


const senderMessageService=(req,res)=>{
  const {name,email,subject}=req.body
  try {
    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email.length>0) {
      res.status(400).json({message:'O email deve ser valido !'})
    }


    if (!name&&!email&&!subject) {
      console.log('E obrigatorio preencher com dados  corretos !');
      res.status(400).json({message:'E obrigatorio preencher com dados  corretos ! '})
      return
    }

if (subject.length<50) {
  res.status(402).json({message:'A mensagem nao deve ser curto demais'})
}
    if (name &&email &&subject ) {
      res.status(200).json({message:'Obrigado por entrar em contato connosco, em breve iremos contactar-lhe'})
      return
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
const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email) && email.length>0) {
  res.status(400).json({message:'O email deve ser valido !'})
}
    const user=await User.findOne({where:{email}})
    const token= jwt.sign({userId:user._id},secretKey,{expiresIn:'1h'})
     const dateExpToken =new Date(Date.now()+3600000)
    const saved=await User.update(
                {resetToken:token,
                 resetTokenExpires:dateExpToken},
                 {where:{email}})
    if (!saved) {
      console.log('O token nao foi guardado no banco de dados');
    }else{
      console.log('O token foi guardado no banco de dados');
    }
    console.log(token);
    res.json({token})
    if (user) {
      console.log('Usuario encontrado');  
    }else{
      console.log('Usuario nao encontrado');
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
      subject:'Recuperacao de senha. ',
      html:`
      <p>OLa ${user.email}<p>
      <p>
        Voce solicitou a recuperacao da senha. Clique no link abaixo 
        para redefenir a sua senha 
      <p>
      <p> 
        <a href='http://localhost:3000/NewPassword/?token=${token}>Redefinir Senha<a>
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

const newPassword= async(req, res)=>{
 const {token} = req.body
 console.log(token);
 const {password}=req.body
 
 const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
 if (!passwordRegex.test(password) && password.length>0) {
   res.status(400).json({message:'A senha deve pelo menos ter 8 caracteres, incluindo letras maisuculas,minusculas e numeros !'})
   return
 }

 console.log(`Senha:  ${password}`);
try {
  const decodedToken=jwt.verify(token, secretKey);
  if (!decodedToken) {
    console.log('Token invalido');
    return res.status(404).send({message:'Token invalido'})
  }else{
    console.log('Token valido');
  }
  const user=await User.findOne({resetToken:decodedToken});
  if (user ) {
    console.log('O usuario encontrado');
  } else {
    console.log('Usuario nao encontrado');
  }
const passwordHashed=await bcrypt.hash(password,10)

const saved=  await User.update({password:passwordHashed},{where:{id:user.id}})
    if (!saved) {
      console.log('O  password nao foi atualizado banco de dados');
    }else{
      console.log('O  password foi atualizado no banco de dados');
    return res.status(200).send({message:'O  password foi atualizado com sucesso'})
    }
await User.update({resetToken:null,resetTokenExpires:null},{where:{id:user.id}})

} catch (error) {
 console.log('Falha ao atualizar: '+error); 
}
}

const notfound=async(req,res)=>{
  res.status(404).send({message:'Page not found'})
}
      
module.exports={ 
  register,
  login,
  senderMessageService,
  resetPassword,
  newPassword,
  notfound,
  logout
} 