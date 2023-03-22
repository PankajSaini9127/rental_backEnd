const express = require('express');
const { LoginCred } = require('../controller/LoginControls');

const router =  express.Router();


//path  /api/auth/login
//post request   req.body {"email":email/username}
//controllers/loginConteols
router.route('/login').post(LoginCred)


module.exports = router