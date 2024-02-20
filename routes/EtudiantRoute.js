const express = require('express')
const { home, loginForm, postLogin, listeEC, noteSemestre, noteChoixSem, voirEdt, formChangeMdp, postChangeMdp, resetPassForm, resetPassword, verificationToken, resetChangePass, deconnexion, CDTmatiere, CDTmarque, CDTpostMarque, choisirOption, } = require('../controllers/EtudiantController')
const router = express.Router()
const {ensureAuthenticated , passEtudiant , verifSemestre} = require('../config/security')

router.get('/home' ,ensureAuthenticated, passEtudiant,verifSemestre,home)
router.get('/login' ,loginForm)
router.get('/liste_matiere' ,ensureAuthenticated, passEtudiant,verifSemestre, listeEC)
router.get('/note_semestre' ,ensureAuthenticated, passEtudiant,verifSemestre, noteSemestre)
router.get('/note/semestre/:SemestreId' , ensureAuthenticated, passEtudiant,verifSemestre,noteChoixSem)
router.get('/edt' ,ensureAuthenticated, passEtudiant,verifSemestre, voirEdt)
router.get('/etudiantChoix_option/:FiliereId/:SemestreId/:UtilisateurId/:OptionId' ,ensureAuthenticated, passEtudiant, choisirOption)
router.get('/changePassword' ,ensureAuthenticated, passEtudiant,verifSemestre, formChangeMdp)
router.get('/deconnexion' ,ensureAuthenticated, passEtudiant,verifSemestre, deconnexion)
router.get('/CDT/liste_matiere/:FiliereId/:SemestreId/:OptionId' ,ensureAuthenticated, passEtudiant,verifSemestre, CDTmatiere)
router.get('/CDT/marque/:ECId' ,ensureAuthenticated, passEtudiant,verifSemestre, CDTmarque)



router.post('/changePassword' , postChangeMdp)
router.post('/CDT/marque/:ECId' ,ensureAuthenticated, passEtudiant,verifSemestre,CDTpostMarque )
router.post('/login' , postLogin)

// router.get('/resetPass/form' ,resetPassForm)
// router.post('/resetPass/ChangePass' , resetChangePass)
// router.post('/resetPass/sendCode' , resetPassword)
// router.post('/resetPass/verificationCode' , verificationToken)





module.exports = router

