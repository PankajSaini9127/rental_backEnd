require("dotenv").config();
const { select } = require("../data/db");
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
      .select('landlords.name','landlords.agreement_id','landlords.location','landlords.id','agreements.*')
              .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')


              let ids = [];
              let agreement = {}
               data.map((row)=>{
                if(ids.includes(row.id)){
                  agreement = {...agreement,[row.id]:{...agreement[row.id],name :[...agreement[row.id].name,row.name]}}
                }else{
                  ids.push(row.id)
                  agreement = {...agreement,[row.id]:{...row,name:[row.name]}}

                }
               })
       console.log(agreement)

              // console.log(data)

        res.send({success:true,agreement,ids})
    } catch (error) {
      console.log(error)
res.send({success:false,message:"something Went Wrong please try again later"})
    }
}


const get_tenure = async(req,res)=>{
     try {
      var m11 = new Date(Date.now());

m11.setMonth(m11.getMonth() - 10);

console.log('11m>>>',m11);

var y3 = new Date(Date.now());
y3.setMonth(y3.getMonth() - (10 * 3));
console.log('y3>>>',y3);

var y5 = new Date(Date.now());
y5.setMonth(y5.getMonth() - (10 * 5));
console.log('y5>>>',y5);

         var tenure11Month = await db.from('agreements').select('*')
         .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')
         .orderBy('agreements.time',"desc")
       tenure11Month =  tenure11Month.map((row,i)=>{

        switch (row.tenure) {
          case "11 Month":var m11 = new Date(row.time);
          m11.setMonth(m11.getMonth() - 10);
       return row.time >= m11 && row
            
            case "3 Year" : var y3 = new Date(Date.now());
            y3.setMonth(y3.getMonth() - (10 * 3));
            return row.time >= y3 && row
        
          case "5 Year" : 
          var y5 = new Date(Date.now());
   y5.setMonth(y5.getMonth() - (10 * 5));
   return row.time >= y5 && row

  default: return row
        }
       
          

       

         })
      console.log(tenure11Month)
    return  res.send({success:true,renewal:tenure11Month})
     } catch (error) {
        console.log(error)
        return res.status(500).send()
     }
}

async function getAgreementById (req,res){
    try {
      const agreement = await db('landlords')
      .join('agreements', 'agreements.id', '=', 'landlords.agreement_id')
      .select('*')

      agreement.map((row,i)=>{
        console.log(row.id,req.params.id)
        if(row.agreement_id == req.params.id){
          return res.send(row)
        }
      })
  
    // return res.send(agreement)
  
    } catch (error) {
      console.log(error)
      return res.status(500).send()
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
      console.log(req.params.id)
         const result = await db('agreements').where('id',req.params.id).del() ;
         const landlords = await db('landlords').where('agreement_id',req.params.id).del() ;
         console.log(result,landlords)
         if(result === 1 && landlords === 1){
          res.status(202).send({success:true,message:"Delete Successful"})
         }else{
          res.send({success:false,message:"Something went Wrong Please try again later"})
         }
    } catch (error) {
      console.log(error)
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




async function get_monthly_rent (req,res){
  try {

       var tenure11Month =await db.from('agreements').select('*')
       .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')
       .orderBy('agreements.time',"desc")
       console.log(tenure11Month)
     tenure11Month =  tenure11Month.map((row,i)=>{

      var m11 = new Date(row.time);
        m11.setMonth(m11.getMonth() - 1);
     return row.time >= m11 && row  
             

       })

  return  res.send({success:true,monthly_rent:tenure11Month})
   } catch (error) {
      console.log(error)
      return res.status(500).send()
   }
}


async function getStateList(req,res){
  try {

    if(req.query.search)
    {
      let {search} = req.query
      let stateList = await db.table('states').select('name','id').whereILike('name',`%${search}%`).limit(10);

      if(stateList)
      {
        return res.send(stateList)
      }
    }
    else return res.send([])

    
  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }

}

async function getCityList(req,res){
  try {

    if(req.query.search)
    {
      let {search} = req.query
      let cityList = await db.table('cities').select('city','state_id').where('state_id',`${search}`).limit(10);

      if(cityList)
      {
        return res.send(cityList)
      }
    }
    else return res.send([])

    
  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }

}


module.exports = {getCityList,getStateList,get_monthly_rent,get_tenure,newAgreement,getAllAgreement,getAgreementById,updateAgreement,deleteAgreement,add_landlord,uploadDoc}  