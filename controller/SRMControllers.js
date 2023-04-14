const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db('users').select('*').where('supervisor', '=', req.params.id)

    if (supervisor.length === 0) throw new Error()

    // for getting the name for Sr manager 
    let manager_name = {}
    supervisor.map(row => {
      manager_name = { ...manager_name, [row.id]: row.name }

    })

    let data = await Promise.allSettled(supervisor.map(async (row) => {
      console.log(row.id); return await db("agreements")
        .select(
          "landlords.name",
          "landlords.agreement_id",
          "landlords.id ",
          "agreements.*"
        )
        .join("landlords", "agreements.id", "=", "landlords.agreement_id")
        .where('manager_id', row.id).whereNot('status', '=', "Hold").orderBy('agreements.id',"desc")
    }))


    // console.log(">>up>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []



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
            manager: manager_name[row.manager_id]
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name], manager: manager_name[row.manager_id] } };
      }
    });

    console.log('>>>', ids, agreement)



    return res.send({ success: true, agreement, ids });


  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};


//search use by field name
async function user_search_srmanager(req, res) {
  try {         // for getting the name for Sr manager 
    let manager_name = {}
    supervisor.map(row => {
      manager_name = { ...manager_name, [row.id]: row.name }

    })

    let data = await Promise.allSettled(supervisor.map(async (row) => {
      console.log(row.id); return await db("agreements")
        .select(
          "landlords.name",
          "landlords.agreement_id",
          "landlords.id ",
          "agreements.*"
        )
        .join("landlords", "agreements.id", "=", "landlords.agreement_id")
        .where('manager_id', '=', row.id).whereNot('status', '=', "Hold")
        .whereLike('name', '=', req.body.name)
    }))


    // console.log(">>up>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []



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
            manager: supervisor[0].name
          },
        };
      } else {
        ids.push(row.id);
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name], manager: manager_name[row.srm_id] } };
      }
    });

    console.log('>>>', ids, agreement)



    return res.send({ success: true, agreement, ids });

  } catch (error) {
    console.log(error)
    return res.status(500).send()

  }
}


//month rent Show list get all
async function srm_get_monthly_rent(req,res){
  try {
    const supervisor = await db('users').select('*').where('supervisor', '=', req.params.id)

    if (supervisor.length === 0) throw new Error()

    let manager_name = {}
    supervisor.map(row => {
      manager_name = { ...manager_name, [row.id]: row.name }
    })
    
    let data = await Promise.allSettled(supervisor.map(async (row) => {
      console.log(row.id); return await db("monthly_rent")
        .select("*")
        .where('manager_id', row.id)
        .whereNot('status', '=', "Hold")
        .orderBy('id',"desc")
    }))


    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []

    console.log(">>up>",data)

    let ids = [];
    let agreement = {};


    data.map((row) => {
      console.log(row)
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            manager: manager_name[row.manager_id]
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name], manager: manager_name[row.manager_id] } };
      }
    });

    console.log('>>>', ids, agreement)



    return res.send({ success: true,ids, agreement  });

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
  }
}


//monthy rent by id 
async function srm_get_monthly_rent_id (req,res){
  try {
    const data = await db('monthly_rent').select("*").where("id","=",req.params.id)

    console.log(data)

    if(data.length === 0){
     return res.status(404).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
    }else{
    return res.send({succes:true,data})
    }

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
  }
}



module.exports = { getAllAgreement, user_search_srmanager,srm_get_monthly_rent,srm_get_monthly_rent_id }