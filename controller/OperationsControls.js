const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id)

    // for getting the name for Sr manager
    // let Sr_names = {};
    // supervisor.map((row) => {
    //   Sr_names = { ...Sr_names, [row.id]: row.name };
    // });

    // console.log(Sr_names);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
       
        return await db("agreements")
          .select(
            "users.name as manager_name",
            "srm.name as Sr_name",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*"
          )
          .where("buh_id",'=', row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users","agreements.manager_id","=","users.id")
          .join("users as srm","agreements.srm_id","=","srm.id")
          .orderBy('agreements.modify_date',"desc")
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
          },
        };
      } else {
        ids.push(row.id);
        agreement = {
          ...agreement,
          [row.id]: { ...row, name: [row.name]},
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
async function agreement_search_opr(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", req.params.id);

      console.log(req.query)
    const data = await db("agreements")
      .select(
      "users.name as manager_name",
      "srm.name as Sr_name",
      "landlords.name",
      "landlords.agreement_id",
      "landlords.id as landlords",
      "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .join("users","agreements.manager_id","=","users.id")
      .join("users as srm","agreements.srm_id","=","srm.id")
      .where("buh_id", supervisor[0].id)
      .whereNot("agreements.status", "=", "Hold")
      .andWhere((cb) => {
        cb.whereILike("landlords.name", `%${req.query.search}%`);
        cb.orWhereILike("agreements.location", `%${req.query.search}%`);
        cb.orWhereILike("monthlyRent", `%${req.query.search}%`);
        cb.orWhereILike("agreements.code", `%${req.query.search}%`);
        cb.orWhereILike("agreements.address", `%${req.query.search}%`);
      })
      .orderBy('agreements.modify_date',"desc")
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
    
    let data = await Promise.allSettled(result.map(async (row) => {
      console.log(row.id); return await db("monthly_rent")
      .select("users.name as manager_name","monthly_rent.*")
      .where('buh_id', row.id)
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


//dashboard  item
async function get_dashboard_dats_opr(req, res) {
  try {
console.log(req.params.id)
    let status = await db("users").select('users.id')
    
    .join("agreements","agreements.buh_id","=","users.id")
    .where("supervisor","=",req.params.id)
    
   console.log(status)

    let meta = {
      totalAgreement: 0,
      Pending: 0,
      Send_Back: 0,
      Approved: 0,
      Renewal: 0,
    };
    //console.log(status)

    if (status) {
      status.map((row) => {
        meta.totalAgreement += 1;
        if (row.status === "Sent Back From Operations") {
          meta.Send_Back += 1;
        } else if (
          row.status === "Sent To Finance Team" ||
          row.status === "Deposited"
        ) {
          meta.Approved += 1;
        } else if (row.status === "Sent To Operations") {
          meta.Pending += 1;
        }
      });
    }

    console.log(status)

    res.send(meta);
  } catch (err) {
    console.log(err)
    res.status(500).send("something went wrong");
  }
}


module.exports = { get_dashboard_dats_opr,getAllAgreement, agreement_search_opr ,get_monthly_rent_opr,get_monthly_search_opr};
