const db = require("../data/db");

const getAllAgreement = async (req, res) => {
    try {
        const supervisor = await db('users').select('*').where('supervisor','=',req.params.id)
           
        if(supervisor.length === 0 ) throw new Error()

         // for getting the name for Sr manager 
    let manager_name = {} 
    supervisor.map(row=>{
    manager_name = {...manager_name, [row.id] : row.name} 

    })

    let data = await Promise.allSettled(supervisor.map(async (row)=>{ console.log(row.id); return await db("agreements")
    .select(
      "landlords.name",
      "landlords.agreement_id",
      "landlords.id ",
      "agreements.*"
    )
    .join("landlords", "agreements.id", "=", "landlords.agreement_id")
    .where('manager_id','=',row.id).whereNot('status','=',"Hold")    
}))
    
    
    // console.log(">>up>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row,i)=>row) : []

  
        
    // console.log(">>down>",data)

  let ids = [];
  let agreement = {};

  // if(data[0] === undefined) 
  // return res.send({ success: true, agreement  , ids });


  data.map((row) => {
    if (ids.includes(row.id)) {
      agreement = {
        ...agreement,
        [row.id]: {
          ...agreement[row.id],
          name: [...agreement[row.id].name, row.name],
          manager:manager_name[row.manager_id]
        },
      };
    } else {
      ids.push(row.id);
      console.log(">>>>>",row.manager_id)
      agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager: manager_name[row.manager_id]} };
    }
  });

  console.log('>>>',ids,agreement)



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
async function user_search_srmanager (req,res){
  try {         // for getting the name for Sr manager 
    let manager_name = {} 
    supervisor.map(row=>{
    manager_name = {...manager_name, [row.id] : row.name} 

    })

    let data = await Promise.allSettled(supervisor.map(async (row)=>{ console.log(row.id); return await db("agreements")
    .select(
      "landlords.name",
      "landlords.agreement_id",
      "landlords.id ",
      "agreements.*"
    )
    .join("landlords", "agreements.id", "=", "landlords.agreement_id")
    .where('manager_id','=',row.id).whereNot('status','=',"Hold")    
    .whereLike('name','=',req.body.name)
}))
    
    
    // console.log(">>up>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row,i)=>row) : []

  
        
    // console.log(">>down>",data)

  let ids = [];
  let agreement = {};

  // if(data[0] === undefined) 
  // return res.send({ success: true, agreement  , ids });


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
      agreement = { ...agreement, [row.id]: { ...row, name: [row.name] ,manager: manager_name[row.srm_id]} };
    }
  });

  console.log('>>>',ids,agreement)



 return res.send({ success: true, agreement, ids });

  } catch (error) {
      console.log(error)
    return  res.status(500).send()
      
  }
}





module.exports = {getAllAgreement,user_search_srmanager}