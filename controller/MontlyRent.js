const db = require("../data/db");


async function get_landlord_id(req,res){
    try {
        console.log(req.params.id)
        const landlords = await db('landlords').select("id").where("agreement_id","=",req.params.id);
        console.log(landlords)
        res.send({success:true,landlords_id:landlords})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({success:false,mesage:"Something Went Wrong! Please Try Again Later."})
    }

}

//add monthly rent in monthly rent table
//route /api/monthly_rent
async function add_rent(req,res){
   try {
    console.log(req.body)
    const data = await db('monthly_rent').insert({
        agreement_id:req.body.agreement_id,
        landlord_id:req.body.landlord_id,
        rent_amount:req.body.amount,
        rent_month:req.body.rent_month
    })
    console.log(data)
    if(data.length > 0){
      return  res.send({success:true})
    }else{
       return res.send({success:false})
    }
   } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Something Went Wrong Please Try Again later."})
   }
}

module.exports ={add_rent,get_landlord_id}