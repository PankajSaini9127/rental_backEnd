const express = require('express');

const router = express.Router();

const db = require("../data/db");

router.route('/').get((req,res)=>{
    res.send('operations')
})

router.route('/agreement/:id').post(async(req,res)=>{
    try {
        const result = await db('opr_greements').insert(req.body)
       if(result.length == 1){
        const status = await db('srm_greements').where('id',req.params.id).update({"status":"Approved"})
        console.log(status,req.params.id)
          res.status(201).send({success:true,message:"Agreement Approved And Sent To Operations Successfully"})
       }
       else{
          throw new Error({success:false,message:"Something went wrong Please Try After Some Time"})
       }
        
    } catch (error) {
        res.send({success:false,message:"Something went wrong Please Try After Some Time",})
    }
})

router.route('/get-agreements').get(async(req,res)=>{
    try {
        const agreements = await db.from('opr_greements').select("code",'id','leeseName','location','manager','srmanager','monthlyRent')
        res.send({success:true,agreements})
    } catch (error) {
        res.send(error)        
    }
})

router.route("/getagreement/:id").get(async(req,res)=>{
    try {
        const agreements = await db.from('opr_greements').select('*').where('id',req.params.id)
        res.send({success:true,agreements})
    } catch (error) {
res.send({success:false,message:"something Went Wrong please try again later"})
    }
})

module.exports = router