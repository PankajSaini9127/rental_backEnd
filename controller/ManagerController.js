const db = require("../data/db");

const newAgreement = async (req, res) => {
 
    try {
  
      const agreement = await db("agreements").insert(req.body);
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
    console.log(lanloard)
  } catch (error) {
    console.log(error)
  }

}

const getAllAgreement  = async(req,res)=>{
    try {
        const agreements = await db.from('agreements').select('*')
        res.send({success:true,agreements})
    } catch (error) {
res.send({success:false,message:"something Went Wrong please try again later"})
    }
}

const getAgreementById = async(req,res)=>{
    try {
      
      const agreement = await db.from('agreements').select("*").where('id',req.params.id)
  
      res.send(agreement)
  
    } catch (error) {
      
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

module.exports = {newAgreement,getAllAgreement,getAgreementById,updateAgreement,deleteAgreement,add_landlord}  