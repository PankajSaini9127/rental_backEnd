 const db = require('../data/db')
 
 
 async function updateStatus (req,res){
    try {
       const update = await db('users').where('id',req.params.id).update(req.body)
       if(update === 0) throw new Error("Something Went Wrong Please try again later")

        return res.send({success:true,message:"User status Updated"})
    } catch (error) {
       return res.status(203).send({success:false,message:"Something Went Wrong Please try again later"})
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
        console.log(req.body)
        let user = await db.from('users').select('name',"role","id").where(cb=>{
            req.body.map((row,i)=>{
              return  cb.orWhereILike('role',`%${row}%`)
            })
        })
        console.log(user)
        
        
       return  res.send((user))
        
      
        }
     catch (error) {
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
    }
    } catch (error) {
        console.log(error)
     return res.status(203).send({success:false,message:"May be the emaill is occupied."})
    }
     
 }

async function get_user (req,res){
    try {
        const user = await db('users').where('id',req.params.id).select("*")
      return  res.send(user)
    } catch (error) {
      return res.status(500).send()        
    }
}


async function get_emp_code (req,res){
    try {
        const users = await db.from('users').select("code").orderBy("id","desc").limit(1)
        console.log(users, "line no 94")
        if(users.length === 0){
            const code = "EMP-1"
            return   res.send({code})
        }else{
            
            const empCode ="EMP-"+ (parseInt(users[0].code.split("-")[1])+1)
          return res.send({success:true,code:empCode})
        }
        // res.send(users)
        // res.send()
    } catch (error) {
        console.log(error)
       return res.status(500).send()
    }
}


async function user_search (req,res){
    try {
        const user = await db('users').select("*").whereILike('name',`%${req.body.name}%`)
      return  res.send(user)
    } catch (error) {
        console.log(error)
      return  res.status(500).send()
        
    }
}

//  meta data of user counts 


async function getMetaData (req,res){
    try{
        let user = await db('users').select('role')

        let meta = {
            BHU : 0,
            Senior_Manager : 0,
            Manager : 0,
            Finance : 0,
            Operations : 0,
        }

        if(user){
            user.map(row=>{
                row.role = JSON.parse(row.role)
                if(row.role.includes('BHU'))
                meta.BHU += 1
                else if(row.role.includes('Senior Manager'))
                meta.Senior_Manager += 1
                else if(row.role.includes('Manager'))
                meta.Manager += 1
                else if(row.role.includes('Finance'))
                meta.Finance += 1
                else if(row.role.includes('Operations'))
                meta.Operations += 1
            })
        }

        console.log(meta)

        res.send(meta)

    }
    catch(err){
        console.log(err)
        res.status(500).send('something went wrong');
    }

}

module.exports = {updateStatus,forgotPassword,selectRole,getAllUser,updateUser,get_user,get_emp_code,user_search, getMetaData}