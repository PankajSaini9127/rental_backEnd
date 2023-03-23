const db = require('../data/db');
const nodemailer = require("nodemailer");

const MailGen = require('mailgen')

require('dotenv').config()



const userRegistration = async(req,res)=>{
    const {code,name,email,role,supervisor} = req.body;

    try {
          const checkEmail = await db.from('users').select("email").where({email})
           
          if(checkEmail.length == 1){
           return res.status(208).send({message:"Email Has already Register"})
          }else
           if(code && name && email  && role && supervisor){
            
            req.body.role= JSON.stringify(req.body.role)
            req.body.password = "andromeda2023" ; 
            const user = await db("users").insert(req.body)

            //for sending mail call sendMail
           const mail = await sendMail(req.body).catch(error=>{
            console.log(error)
           })
           
           return res.status(201).send({success:true,message:"User register succsessful & Login Details Send To Your Email Address",user})

           
          }else{
          throw new Error({success:false,message:"All filds are required"})
          }

    } catch (error) {
        console.log(error)
       return res.status(422).send({success:false,message:"All filds are required"})
    }
   
    
 }


const testMail = async(req,res)=>{

   const mail = await sendMail(req.body)
   res.send(mail)

}

const sendMail = async (user)=>{
    
    const config = {
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    }

    const transporter = nodemailer.createTransport(config);

    const mailGenerator = new MailGen({
        theme:"cerberus",
        product:{
            name:"ANDROMEDA",
            dec:"India's Largest Load Distributer",
            link:"https://rental-system-bitwit.netlify.app/",
            copyright: 'Copyright © 2023 Andromeda. All rights reserved.',
        }
    })

const response = {
    body:{
        name:user.name,
        intro:`User Added Successfully`,
        title: "Welcome to ANDROMEDA India's Largest Lone Distributor",
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        table:[{
            data:[
                {
                    Name: user.name,
                    UserName: user.email,
                    Mobile : user.mobile,
                    Password : user.password
                }
            ],
            columns:{
                customWidth:{
                    Name:'25%',
                    UserName:'50%',
                    Mobile:'25%',
                    Password : '50%'

                },
                customAlignment:{
                    Name:'center',
                    UserName:'center',
                    Mobile:"center",
                    Password : "center"
                }
            }
        },
        {
            data:[
                {
                    Password: user.password,
                    Role: user.role,
                    Supervisor:user.supervisor
                }
            ],
            columns:{
                customWidth:{
                    Password:'25%',
                    Role:'50%',
                    Supervisor:'25%'
                },
                customAlignment:{
                    Password:'center',
                    Role:'center',
                    Supervisor:"center"
                }
            }
        }
    
    ]
    }
}


const mail = mailGenerator.generate(response)

    const message = {
        from:process.env.EMAIL_USER , // sender address
        to: user.email, // list of receivers
        subject: "User Register Successfully", // Subject line
        html:mail,
        // text: "Rental Poral User Registration successfully", // plain text body
        // html: `Code:${user.code}, Name: ${user.name}, email:${user.email}, Password:${user.password}, Role:${user.role}, Supervisor:${user.supervisor} `, // html body
        
      }

    const info = await transporter.sendMail(message)  

}


module.exports = {userRegistration,testMail}