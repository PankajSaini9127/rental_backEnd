const express = require('express');
const { LoginCred, SuperAdminCreds } = require('../controller/LoginControls');

const router =  express.Router();


//path  /api/auth/login
//post request   req.body {"email":email/username}
//controllers/loginConteols
router.route('/login').post(LoginCred)

//path /api/auth/super-admin-creds
//post req.body {email,password,role}

router.route('/super-admin-creds').post(SuperAdminCreds)

module.exports = router