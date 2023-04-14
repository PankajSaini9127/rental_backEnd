const db = require("../data/db");


async function get_landlord_id(req,res){
    try {
        //console.log(req.params.id)
        const landlords = await db('landlords').select("id").where("agreement_id","=",req.params.id);
        //console.log(landlords)
        res.send({success:true,landlords_id:landlords})
        
    } catch (error) {
        //console.log(error)
        res.status(500).send({success:false,message:"Something Went Wrong! Please Try Again Later."})
    }

}

//add monthly rent in monthly rent table
//route /api/monthly_rent
async function add_rent(req,res){
   try {
    //console.log(req.body)
    const data = await db('monthly_rent').insert({
        code :req.body.code ,
        location :req.body.location ,
        gst :req.body.gst ,
        utr_no :req.body.utr_no ,
        landlord_name :req.body.landlord_name ,
        status :req.body.status ,
        rent_date:req.body.rent_date,
        rent_amount:req.body.rent_amount,
        landlord_name:req.body.landlord_name,
        share:req.body.share,
        monthly_rent:req.body.monthly_rent
    })
    //console.log(data)
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

async function list_month_rent(req,res){
    try{
        const data = await db('monthly_rent').select("*")

        //console.log(data)
        if(data)
        return  res.send(data)
        else
        return res.send([])
    }
    catch(err){
        //console.log(err)
        return res.status(500).send("Something went wrong")
    }
}

module.exports ={add_rent,get_landlord_id,list_month_rent}