const express = require('express');

const router =  express.Router();

const db = require("../data/db");

router.route('/').get((req,res)=>{
    res.send('status Login')
})


router.route('/login').post(async(req,res)=>{
        try {
            const result = await db.from('users').select('*').where(req.body)

        if(result[0].status === "Active"){
            
            if(result.length <1){
                res.status(200).send({success:false,message:"User Not Found Please Register First."})
            }else{
                res.send({success:true,result})
            }
        }else{
            res.send({success:false,message:"User Inactive!"})
        }
        }
    
        
            
        catch (error) {
             res.send({success:false,message:'Something Went wrong Please Try Again Later.'})
        }
}
)


module.exports = router