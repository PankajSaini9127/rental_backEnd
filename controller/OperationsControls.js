// const db = require('../data/db');

// async function SRMApproval (req,res){
//     try {
//         const result = await db('opr_greements').insert(req.body)
//        if(result.length == 1){
//         const status = await db('srm_greements').where('id',req.params.id).update({"status":"Approved"})
//          return res.status(201).send({success:true,message:"Agreement Approved And Sent To Operations Successfully"})
//        }
//        else{
//           throw new Error({success:false,message:"Something went wrong Please Try After Some Time"})
//        }
        
//     } catch (error) {
//       return res.send({success:false,message:"Something went wrong Please Try After Some Time",})
//     }
// }


// async function getAllAgreements (req,res){
//     try {
//         const agreements = await db.from('opr_greements').select("code",'id','leeseName','location','manager','srmanager','monthlyRent')
//         if(!agreements) throw new Error()
//       return  res.send({success:true,agreements})
//     } catch (error) {
//        return res.status(500).send({message:"Something went Wrong please try again later!"})        
//     }
// }


// async function getagreement (req,res){
//     try {
//         const agreements = await db.from('opr_greements').select('*').where('id',req.params.id)
//         if(!agreements) throw new Error()

//         return res.send({success:true,agreements})
//     } catch (error) {
//       return res.status(500).send({success:false,message:"something Went Wrong please try again later"})
//     }
// }

// module.exports= {SRMApproval,getAllAgreements,getagreement}

const db = require("../data/db");

const getAllAgreement = async (req, res) => {
    try {
        const supervisor = await db('users').select('*').where('supervisor','=',req.params.id)
    //    console.log(">>>",supervisor)

    // for getting the name for Sr manager 
    let Sr_names = {} 
    supervisor.map(row=>{
    Sr_names = {...Sr_names, [row.id] : row.name} 

    })

    console.log(Sr_names)

       let data = await Promise.allSettled(supervisor.map(async (row)=>{ console.log(row); return await db("agreements")
        .select(
          "landlords.name",
          "landlords.agreement_id",
          "landlords.id as landlords",
          "agreements.*"
        )
        .join("landlords", "agreements.id", "=", "landlords.agreement_id")
        .where('bhu_id',row.id)    
    }))
    
    data = data.map((row)=>row.status === 'fulfilled' && row.value[0]  ) 
    
    // console.log(">>>data" ,data)
    
          let ids = [];
          let agreement = {};



      data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              manager:supervisor[0].name
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager: Sr_names[row.bhu_id]} };
        }
      });

      // console.log('>>>',ids,agreement)



     return res.send({ success: true, agreement, ids });
    } catch (error) {
      console.log(error);
    return  res.send({
        success: false,
        message: "something Went Wrong please try again later",
      });
    }
  };


//search use by field name
async function user_search_bhu (req,res){
  try {
    

    const supervisor = await db('users').select('*').where('supervisor',req.params.id)


       
      const data = await db('agreements').select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where('manager_id',supervisor[0].id).whereNot('status','=',"Hold")
      .whereILike('name',`%${req.body.name}%`)
      console.log(data)
      
   
      let ids = [];
      let agreement = {};
      data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              manager:supervisor[0].name
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager:supervisor[0].name} };
        }
      });
  
      // console.log(data)
  
      res.send({ success: true, agreement, ids });

  } catch (error) {
      console.log(error)
    return  res.status(500).send()
      
  }
}





module.exports = {getAllAgreement,user_search_bhu}