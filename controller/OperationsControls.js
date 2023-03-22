const db = require('../data/db');

async function SRMApproval (req,res){
    try {
        const result = await db('opr_greements').insert(req.body)
       if(result.length == 1){
        const status = await db('srm_greements').where('id',req.params.id).update({"status":"Approved"})
         return res.status(201).send({success:true,message:"Agreement Approved And Sent To Operations Successfully"})
       }
       else{
          throw new Error({success:false,message:"Something went wrong Please Try After Some Time"})
       }
        
    } catch (error) {
      return res.send({success:false,message:"Something went wrong Please Try After Some Time",})
    }
}


async function getAllAgreements (req,res){
    try {
        const agreements = await db.from('opr_greements').select("code",'id','leeseName','location','manager','srmanager','monthlyRent')
        if(!agreements) throw new Error()
      return  res.send({success:true,agreements})
    } catch (error) {
       return res.status(500).send({message:"Something went Wrong please try again later!"})        
    }
}


async function getagreement (req,res){
    try {
        const agreements = await db.from('opr_greements').select('*').where('id',req.params.id)
        if(!agreements) throw new Error()

        return res.send({success:true,agreements})
    } catch (error) {
      return res.status(500).send({success:false,message:"something Went Wrong please try again later"})
    }
}

module.exports= {SRMApproval,getAllAgreements,getagreement}