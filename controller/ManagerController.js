require("dotenv").config();
const db = require("../data/db");

const newAgreement = async (req, res) => {
 
    try {
  
      const agreement = await db("agreements").insert({...req.body,status:"Send To Manager"});
       if(agreement.length == 1){
          res.status(201).send({success:true,message:"Agreement Submit Successfully",agreement})
       }
       else{
          throw new Error({success:false,message:"Something went wrong Please"})
       }
    } catch (error) {
      res.send({success:false,message:"Something went wrong Please",error});
    }
  };


 async function add_landlord (req,res){
  // console.log(req.body)
  try {
    const lanloard = await db("landlords").insert(req.body)
    
    if(lanloard)
    {
      res.send({message : 'Landlord Added.'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({message : 'Something went wrong !!!'})

  }

}

const getAllAgreement  = async(req,res)=>{
    try {
      const data = await db('agreements')
              .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')
              .select('*')

        res.send({success:true,data})
    } catch (error) {
      console.log(error)
res.send({success:false,message:"something Went Wrong please try again later"})
    }
}

async function getAgreementById (req,res){
  console.log("first")
    try {
      console.log(req.params.id)
      const agreement = await db.from('agreements').select("*").where('id',req.params.id)
  
      res.send(agreement)
  
    } catch (error) {
       console.log(error)
    }
}


 
// const UpdateStatus = async(req,res)=>{
//   try {
//     const update = await db('agreements').where('id',req.params.id).update(req.body)
//     if(update === 1){
//       res.send({success:true,message:"Agreement Update Successfully"})
//     }else{
//       throw new Error({success:false,message:"Something went wrong please try again later"})
//     }
//   } catch (error) {
//     res.send({success:false,message:"Something went wrong please try again later"})
//   }
// }  

const updateAgreement = async(req,res)=>{
    try {
      const update = await db('agreements').where('id',req.params.id).update(req.body)
      if(update === 1){
        res.send({success:true,message:"Agreement Update Successfully"})
      }else{
        throw new Error({success:false,message:"Something went wrong please try again later"})
      }
    } catch (error) {
      res.send({success:false,message:"Something went wrong please try again later"})
    }
  }  

const deleteAgreement = async(req,res)=>{
    try {
         const result = await db('agreements').where('id',req.params.id).del() ;
         if(result === 1){
          res.status(202).send({success:true,message:"Delete Successful"})
         }else{
          res.send({success:false,message:"Something went Wrong Please try again later"})
         }
    } catch (error) {
      res.send({success:false,message:"Something went Wrong Please try again later"})
    }
}  

const uploadDoc = async(req,res)=>{
    try {
      if(req.files['photo'])
      {
        res.send({link : `${process.env.IMAGE_LINK_O+req.files['photo'][0].path}`,message : 'Document Uploaded'})
      }
      else{
        res.status(203).send({message : 'Pleae Provide the document.'})
      }
    } catch (error) {
      console.log(error)
      res.send({message:"Something went Wrong !!!"})
    }
}  


module.exports = {newAgreement,getAllAgreement,getAgreementById,updateAgreement,deleteAgreement,add_landlord,uploadDoc}  