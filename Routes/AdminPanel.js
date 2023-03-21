const express = require('express')

const db = require('../data/db')

const hashPassword = require('password-hash');
const {userRegistration,testMail} = require('../controller/UserRegistration');


const router = express.Router();

//add User
//path /api/admin/userRegistration
router.route('/userRegistration').post(userRegistration)



// update Status
// path /api/admin/updateStatus/:id
router.route('/updateStatus/:id').put(async(req,res)=>{
     try {
        const update = await db('users').where('id',req.params.id).update(req.body)
        res.send({success:true})
     } catch (error) {
        
     }
})


//  /api/admin/forgotPassword
router.route('/forgotPassword').post(async(req,res)=>{
    try {
        if(req.body.email === "" || req.body.email === undefined){
         return   res.status(204).send({success:"false",message:"Email Not Provided"})
        }
        const email_ID = await db.from("users").select("id").where("email",'=',req.body.email)
        // console.log(email_ID)
        if(email_ID){
            res.send(email_ID)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(message="somethng went wrong")
    }
})



//api/admin/selectRole
router.route('/selectRole').post(async(req,res)=>{
    console.log(req.body)

    try {
        const user = await db.from('users').select('name').whereLike('role',`%${req.body}%`)
        
        if(user){
      return res.send(user)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send()
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
    req.body.role= JSON.stringify(req.body.role)
    const update = await db("users").where("id",req.params.id).update(req.body)
    if(update){
        res.status(200).send({success:true,message:"User Updated."})
    }
   } catch (error) {
     res.status(500).send({success:false,message:"Somethng went Wrong please try again later"})
   }
    
})


// admin login
//path /api/admin/login
//req body email
router.route('/login').post()


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