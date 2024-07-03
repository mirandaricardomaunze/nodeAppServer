const express=require('express')
const router=express.Router()
const userControllers=require('../controllers/userControllers')

router.post('/register', userControllers.register)
router.post('/login', userControllers.login)
router.post('/subject', userControllers.senderMessageService)
router.post('/reset', userControllers.resetPassword)
router.post('/newPassword', userControllers.newPassword)
router.post('*', userControllers.notfound)
router.post('/logout',userControllers.logout)


module.exports=router