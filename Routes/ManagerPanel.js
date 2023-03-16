const express = require("express");

const db = require("../data/db");

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("hello manager section");
});

// Post request in agreements table
// path /api/newAgreement

router.route("/newAgreement").post(async (req, res) => {
 
  try {

    const agreement = await db("agreements").insert(req.body);
     if(agreement.length == 1){
        res.status(201).send({success:true,message:"Agreement Submit Successfully"})
     }
     else{
        throw new Error({success:false,message:"Something went wrong Please"})
     }
  } catch (error) {
    res.send({success:false,message:"Something went wrong Please",error});
  }
});

//get request in agreements table 
// path /api/agreements

router.route('/agreements').get(async(req,res)=>{
    try {
        const agreements = await db.from('agreements').select('*')
        res.send({success:true,agreements})
    } catch (error) {
res.send({success:false,message:"something Went Wrong please try again later"})
    }
})

//post request in agreements table get agreemennt by id 
// path /api/agreement

router.route('/agreement/:id').post(async(req,res)=>{
  try {
    
    const agreement = await db.from('agreements').select("*").where('id',req.params.id)

    res.send(agreement)

  } catch (error) {
    
  }
})

//Update API 
//Update Request in agreement table 
// path /api/updateAgreement/:id
router.route('/updateAgreement/:id').put(async(req,res)=>{
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
})

// delete agreemenet in agreemenets table
// path /api/delAgreement/:id

router.route('/delAgreement/:id').delete(async(req,res)=>{
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
})



//update agreement in agreement table


module.exports = router;
