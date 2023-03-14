const express = require('express')

const db = require('../data/db')

const hashPassword = require('password-hash')


const router = express.Router();

//add User
//path /api/admin/userRegistration
router.route('/userRegistration').post(async(req,res)=>{
    const {code,name,email,password,role,supervisor} = req.body

    try {
          const checkEmail = await db.from('users').select("email").where({email})

          if(checkEmail.length == 1){
            res.send({message:"Email Has already Register"})
          }else if(code && name && email && password && role && supervisor){
            const user = await db("users").insert(req.body)
            res.status(201).send({success:true,message:"User regidterd succsessful"})
          }else{
            throw new Error({success:false,message:"All filds are required"})
          }

        // const user = await db('users').insert(req.body)
        // res.send(user)
    } catch (error) {
        res.status(422).send({success:false,message:"All filds are required"})
    }
   
    
 })


//get all user users
//path /api/admin/user

router.route('/user').post( async(req,res)=>{
    try {
      const users = await db.from('users').select('*').where(req.body)
   if(users.length > 0 ){
    res.send(users)
   }else{
    throw new Error()
   }
} catch (error) {
     res.send(error)   
}
//    res.send([])
})



//update user users
//path /api/admin/edit/${id}
router.route('/edit/:id').put(async(req,res)=>{
   try {
    const update = await db("users").where("id",req.params.id).update(req.body)
    if(update){
        res.status(200).send({success:true,message:"User Updated."})
    }
   } catch (error) {
     res.status(500).send({success:false,message:"Somethng went Wrong please try again later"})
   }
    
})


//admin signup
//path /api/admin/signup
//body email and password

router.route('/signup').post(async(req,res)=>{
     try {
        const user = await db('login').insert(req.body)
        res.status(201).send(user)
     } catch (error) {
             res.send(error)
     }
})

// admin login
//path /api/admin/login
//req body email
router.route('/login').post(async(req,res)=>{
    try {
        const result = await db.from('login').select('*').where(req.body)
        if(result.length <1){
            res.status(200).send({message:"User Not Registered!"})
        }else{
            res.send(result)
        }


    
        
    } catch (error) {
        //  res.send({message:'Something Went Rong'})
    }
})


//edit user details
//path /api/admin/edit
//req.body updated data

router.route('/edit:id').put(async(req,res)=>{
    req.params.id
    try {
        const update = await db('addUser').update(req.body).where({"id": req.params.id})
        res.status(201).send()
    } catch (error) {
        res.send(error)
    }
})



module.exports = router