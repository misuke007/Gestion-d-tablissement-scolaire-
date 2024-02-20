const express = require('express')

const { resetPassForm, resetPassword, verificationToken, resetChangePass, } = require('../controllers/ResetPassController')
const router = express.Router()

router.get('/resetPass/form' ,resetPassForm)
router.post('/resetPass/ChangePass' , resetChangePass)
router.post('/resetPass/sendCode' , resetPassword)
router.post('/resetPass/verificationCode' , verificationToken)





module.exports = router

