const express = require('express')

const db = require('../data/db')

const hashPassword = require('password-hash');
const {userRegistration,testMail} = require('../controller/UserRegistration');


const router = express.Router();

//add User
//path /api/admin/userRegistration
router.route('/userRegistration').post(userRegistration)
router.route('/test').post(testMail)


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
//body email and password && role

router.route('/signup').post(async(req,res)=>{
    const {email, password, role} = req.body;
     try {
        if(email && password && role){
            const user = await db('login').insert(req.body)
            res.status(201).send(user)
        }else{
            throw new Error({success:false,message:"All Fields Are Require"})
        }
        
     } catch (error) {
             res.send({success:false,message:"All Fields Are Require"})
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