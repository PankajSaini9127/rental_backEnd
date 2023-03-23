const express = require('express');

const router = express.Router();

const db = require("../data/db");

const nodemailer = require("nodemailer");

const MailGen = require('mailgen')

const config = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}

const transporter = nodemailer.createTransport(config);

// const mailGenerator = new MailGen({
//     theme: "cerberus",
//     product: {
//         name: "ANDROMEDA",
//         dec: "India's Largest Load Distributer",
//         link: "https://rental-system-bitwit.netlify.app/",
//         copyright: 'Copyright © 2023 Andromeda. All rights reserved.',
//     }
// })


router.get('/resetPassword', async (req, res) => {
    try {
        console.log(req.query.email)

        let check = await db.table('users').select('*').where('email', `${req.query.email}`)

        console.log(check)

        if (check.length === 0)  return res.status(203).send({message : 'User not found.'});
        
        const message = {
            from: process.env.EMAIL_USER, // sender address
            to: check[0].email, // list of receivers
            subject: "Password reset link", // Subject line
            text: `Password reset link for `, // plain text body
            html: `<h1>Thanks for choosing us !!!</h1>
              <p>Hello ${check[0].name}, please <a href = ${process.env.LINK+check[0].email} >Click Here</a> to login Woodshala.</p>
              <h5>Note :- This link is valid for one time use only.</h5>
              `, // html body
        }
        const info = await transporter.sendMail(message)

        if(info) return res.send({message : 'Password reset link has been sent.'})
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something Went Wrong !!!')
    }
})

router.patch('/reset',async(req,res)=>{
    try {
        if(req.body.password)
        {
            let response = await db.table('users').where('email',req.body.email).update({'password':req.body.password, 'password_flag':1})
            return res.send({message : "Passwword has been reset successfully !!!"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Somthing Went Wrong !!!')
    }
})


module.exports = router;