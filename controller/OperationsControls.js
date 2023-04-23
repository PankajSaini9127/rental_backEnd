const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id)

    // for getting the name for Sr manager
    let Sr_names = {};
    supervisor.map((row) => {
      Sr_names = { ...Sr_names, [row.id]: row.name };
    });

    // console.log(Sr_names);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
       
        return await db("agreements")
          .select(
            "users.name as manager_name",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*"
          )
          .where("buh_id",'=', row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users","agreements.manager_id","=","users.id").orderBy('agreements.modify_date',"desc")
      })
    );

   
    data =
    data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];
    console.log(">>>data" ,data)

    let ids = [];
    let agreement = {};

    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            sr_manager: supervisor[0].name,
          },
        };
      } else {
        ids.push(row.id);
        agreement = {
          ...agreement,
          [row.id]: { ...row, name: [row.name], sr_manager: Sr_names[row.buh_id] },
        };
      }
    });

    // console.log('>>>',ids,agreement)

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
async function user_search_buh(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", req.params.id);

    const data = await db("agreements")
      .select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("manager_id", supervisor[0].id)
      .whereNot("status", "=", "Hold")
      .whereILike("name", `%${req.body.name}%`);
    console.log(data);

    let ids = [];
    let agreement = {};
    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            manager: supervisor[0].name,
          },
        };
      } else {
        ids.push(row.id);
        agreement = {
          ...agreement,
          [row.id]: { ...row, name: [row.name], manager: supervisor[0].name },
        };
      }
    });

    // console.log(data)

    res.send({ success: true, agreement, ids });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}


///get monthly rent 

async function get_monthly_rent_opr(req,res){
  try {

    const result = await db('users')
    .select("*")
    .join('users as buh','buh.supervisor',"=","users.id")
    .where("users.supervisor","=",req.params.id)
    console.log("Join Result>>>>>>>",result)


    let srm_name = {}
    result.map(row => {
      srm_name = { ...srm_name, [row.id]: row.name }
    })
    
    console.log(srm_name)
    let data = await Promise.allSettled(result.map(async (row) => {
      console.log(row.id); return await db("monthly_rent")
      .select("users.name as manager_name","monthly_rent.*")
      .where('srm_id', row.id)
      .join("users","monthly_rent.manager_id","=","users.id")
      .orderBy('id',"desc")
    }))


    // console.log(">>down>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []


    let ids = [];
    let agreement = {};


    data.map((row) => {
      // console.log(row)
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            // name: [...agreement[row.id].name, row.name],
            srm_name: srm_name[row.srm_id]
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.srm_name)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name], srm_name: srm_name[row.srm_id] } };
      }
    });

    // console.log('>>>', ids, agreement)



    return res.send({ success: true,ids, agreement  });

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
  }
}


// monthly serach
async function get_monthly_search_opr (req,res){
  try {
console.log(req.query)
    const result = await db('users')
    .select("*")
    .join('users as buh','buh.supervisor',"=","users.id")
    .where("users.supervisor","=",req.query.id)
    console.log("Join Result>>>>>>>",result)


    let srm_name = {}
    result.map(row => {
      srm_name = { ...srm_name, [row.id]: row.name }
    })
    
    console.log(srm_name)
    let data = await Promise.allSettled(result.map(async (row) => {
      console.log(row.id); return await db("monthly_rent")
      .select("users.name as manager_name","monthly_rent.*")
      .where('srm_id', row.id)
      .join("users","monthly_rent.manager_id","=","users.id")
      .andWhere((cb) => {
        cb.whereILike("monthly_rent.landlord_name", `%${req.query.search}%`);
        cb.orWhereILike("monthly_rent.location", `%${req.query.search}%`);
        cb.orWhereILike("	monthly_rent.gst", `%${req.query.search}%`);
        cb.orWhereILike("monthly_rent.code", `%${req.query.search}%`);
        cb.orWhereILike("monthly_rent.status", `%${req.query.search}%`);
      })
      .orderBy('id',"desc")
    }))


    console.log(">>down>",data)
    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []


    let ids = [];
    let agreement = {};


    data.map((row) => {
      // console.log(row)
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            // name: [...agreement[row.id].name, row.name],
            srm_name: srm_name[row.srm_id]
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.srm_name)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name], srm_name: srm_name[row.srm_id] } };
      }
    });

    // console.log('>>>', ids, agreement)



    return res.send({ success: true,ids, agreement  });

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
  }
}


module.exports = { getAllAgreement, user_search_buh ,get_monthly_rent_opr,get_monthly_search_opr};
