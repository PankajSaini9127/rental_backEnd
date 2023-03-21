const db = require("../data/db");


const managerApproval = async(req,res)=>{
    try {
        const result = await db('srm_greements').insert(req.body)
       if(result.length == 1){
        
        const status = await db('agreements').where('id',req.params.id).update({"status":"Approved"})
        console.log(status,req.params.id)

          res.status(201).send({success:true,message:"Agreement Approved And Sent To Sr Manager Successfully"})
          
       }
       else{
          throw new Error({success:false,message:"Something went wrong Please"})
       }
        
    } catch (error) {
        res.send({success:false,message:"Something went wrong Please"})
    }
}


const getAgreements = async(req,res)=>{
    try {
        const agreements = await db.from('srm_greements').select('*')
        res.send({success:true,agreements})
    } catch (error) {
res.send({success:false,message:"something Went Wrong please try again later"})
    }
}


const getAgreementSRM = async(req,res)=>{
    try {
        const agreements = await db.from('srm_greements').select('*').where('id',req.params.id)
        res.send({success:true,agreements})
    } catch (error) {
res.send({success:false,message:"something Went Wrong please try again later"})
    }
}

module.exports = {managerApproval,getAgreements,getAgreementSRM}