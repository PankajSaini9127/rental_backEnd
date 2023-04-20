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
          .where("op_id",'=', row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users","agreements.manager_id","=","users.id").orderBy('agreements.id',"desc")
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
          [row.id]: { ...row, name: [row.name], sr_manager: Sr_names[row.bhu_id] },
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
async function user_search_bhu(req, res) {
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

const updateAgreement = async (req, res) => {
    try {
      const update = await db("agreements")
        .where("id", "=", req.params.id)
        .update(req.body);
        console.log(update)
      if (update === 1) {
        res.send({ success: true, message: "Agreement Update Successfully" });
      } else {
        console.log(update);
        throw new Error({ success: false, message: "Something went wrong please try again later" })
      }
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        message: "Something went wrong please try again later",
      });
    }
  };


  
  //monthly rent get 

async function finance_get_monthly_rent (req,res){
  try {
    const supervisor = await db('users').select('*').where('supervisor', '=', req.params.id)

    if (supervisor.length === 0) throw new Error()

    let operations_name = {}
    supervisor.map(row => {
      operations_name = { ...operations_name, [row.id]: row.name }
    })
    
    console.log(operations_name)

    let data = await Promise.allSettled(supervisor.map(async (row) => {
     return await db("monthly_rent")
        .select("monthly_rent.*","users.name as srm_name","Manager.name as manager_name")
        .where('op_id', row.id)
        .orderBy('id',"desc")
        .join("users","monthly_rent.srm_id","users.id")
        .join("users as Manager","monthly_rent.manager_id","=","Manager.id")
    }))


    data = data[0].status === 'fulfilled' ? data[0].value.map((row, i) => row) : []

    // console.log(">>up>",data)

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
            operations_name:operations_name[row.op_id]
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name],  operations_name:operations_name[row.op_id] } };
      }
    });

    console.log('>>>', ids, agreement)



    return res.send({ success: true,ids, agreement  });

    
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured Please Try Again Later."})
  }
}
  


// add the all recovery slabs for the respective agreement

async function getRecoveryLog (req,res)
{
  try {
    if(req.query.id)
    {
      console.log(req.query.id)
      let response = await db('recovery_logs').select('*').where('agreement_id',req.query.id)
      let balance = await db('recovery').select('balanceDeposit').where('agreemenet_id',req.query.id)

      if(response)
      {
        console.log(response)
        return res.send({history : response, balance : balance[0] })
      }
    }
    else{
      return res.status(204).send("No data found.")
    }
  } catch (error) {
    console.log(error)
    return res.status(500)
  }
}


// adding the recovery logs amount 
async function insertRecoveryLog (req,res)
{
  try {
    if(req.body)
    {
      let response = await db('recovery_logs').insert(req.body)

      if(response)
      {
        return res.send("Data added successfully.")
      }
    }
    else{
      return res.status(204).send("No data found.")
    }
  } catch (error) {
    console.log(error)
    return res.status(500)
  }
}


module.exports = { getAllAgreement, user_search_bhu ,updateAgreement,finance_get_monthly_rent, insertRecoveryLog,getRecoveryLog};
