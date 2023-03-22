 const db = require('../data/db')
 
 
 async function updateStatus (req,res){
    try {
       const update = await db('users').where('id',req.params.id).update(req.body)
       if(update === 0) throw new Error("Something Went Wrong Please try again later")

        return res.send({success:true,message:"User Updated"})
    } catch (error) {
       return res.status(500).send({success:false,message:"Something Went Wrong Please try again later"})
    }
}


async function forgotPassword (req,res){
    try {
        if(req.body.email === "" || req.body.email === undefined){
         return   res.status(204).send({success:"false",message:"Email Not Provided"})
        }
        const email_ID = await db.from("users").select("id").where("email",'=',req.body.email)
        // console.log(email_ID)
        if(email_ID){
          return  res.send(email_ID)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(message="somethng went wrong")
    }
}


async function selectRole (req,res){
    try {
        const user = await db.from('users').select('name').whereLike('role',`%${req.body}%`)
        
        if(user){
      return res.send(user)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

async function getAllUser (req,res){
    try {
      const users = await db.from('users').select('*').where(req.body)
   if(users.length > 0 ){
    return res.send(users)
   }else{
    throw new Error()
   }
} catch (error) {
    console.log(error)
   return  res.status(500).send({message:"something Went Wrong!"})   
}
}

async function updateUser (req,res){
    try {
     req.body.role= JSON.stringify(req.body.role)
     const update = await db("users").where("id",req.params.id).update(req.body)
     if(update){
        return res.status(200).send({success:true,message:"User Updated."})
     }else{
        throw new Error()
     }
    } catch (error) {
     return res.status(500).send({success:false,message:"Somethng went Wrong please try again later"})
    }
     
 }

module.exports = {updateStatus,forgotPassword,selectRole,getAllUser,updateUser}