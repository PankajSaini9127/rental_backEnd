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
        const data = await db('monthly_rent').select("*").orderBy('id',"desc")

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


async function add_invoice (req,res){
    try {
        const invoice = await db("monthly_rent").update({
              invoice_number:req.body.invoiceNo,
              invoice_date:req.body.invoiceDate,
              rent_amount:req.body.rentAmount,
              gst_amount:req.body.gstAmount,
              invoice:req.body.invoice,
              status:"Sent To Sr Manager",
              manager_id:req.body.manager_id
        }).where("id","=",req.params.id)
     console.log(invoice)
     if(invoice === 1){
         return res.status(201).send({success:true,message:"Invoice Details Added"})
     }else{
        return  res.status(203).send({success:false,message:"omething Went Wrong Please Try Again Later"})
     }
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:"Something Went Wrong Please Try Again Later"})
    }
}

async function update_payment_status(req,res){
    try {
        const invoice = await db("monthly_rent").update(req.body).where("id","=",req.params.id)
        if(invoice === 1){
            return res.status(200).send({success:true,message:"Done"})
        }else{
           return  res.status(203).send({success:false,message:"something Went Wrong Please Try Again Later"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:"Something Went Wrong Please Try Again Later"})
    }
}

module.exports ={add_rent,get_landlord_id,list_month_rent,add_invoice,update_payment_status}