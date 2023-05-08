const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

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
            "users.name as buh",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*",
            "landlords.percentage",
            "landlords.utr_number"
          )
          .where("op_id", "=", row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users", "agreements.buh_id", "=", "users.id")
          .orderBy("agreements.modify_date", "desc");
      })
    );

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];
    console.log(">>>data", data);

    // let ids = [];
    // let agreement = {};

    // data.map((row) => {
    //   if (ids.includes(row.id)) {
    //     agreement = {
    //       ...agreement,
    //       [row.id]: {
    //         ...agreement[row.id],
    //         name: [...agreement[row.id].name, row.name],
    //         sr_manager: supervisor[0].name,
    //       },
    //     };
    //   } else {
    //     ids.push(row.id);
    //     agreement = {
    //       ...agreement,
    //       [row.id]: { ...row, name: [row.name], sr_manager: Sr_names[row.buh_id] },
    //     };
    //   }
    // });

    // console.log('>>>',ids,agreement)

    return res.send({ success: true, agreement: data });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};


const get_all_agreements_inProcess = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

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
            "users.name as buh",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*",
            "landlords.percentage",
            "landlords.utr_number"
          )
          .where("op_id", "=", row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users", "agreements.buh_id", "=", "users.id")
          // .join("renewal_deposit","agreements.id", "=", "renewal_deposit.agreement_id")
          .andWhere(cb=>{
            cb.orWhere('agreements.status',"=","Sent To Sr Manager");
            cb.orWhere('agreements.status',"=","Pending");
            cb.orWhere('agreements.status',"=","Sent To Operations");
            cb.orWhere('agreements.status',"=","Sent To Finance Team");
            cb.orWhere("agreements.status","=","Approved");
            cb.orWhere("agreements.status","=","Terminated By Operations");
            cb.orWhere("agreements.status","=","Approved for Termination");
          })
          .orderBy("agreements.modify_date", "desc");
      })
    );
    // console.log(data)


    let data2 = await Promise.allSettled(
      supervisor.map(async (row) => {
        return await db("agreements")
          .select(
            "agreements.id",
            "renewal_deposit.deposited as old_deposit",
            "renewal_deposit.deposited as new_amount",
          ).join("renewal_deposit","agreements.id", "=", "renewal_deposit.agreement_id")
      })
    );


    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];
    console.log(">>>data", data);

    let depositValue = {}
    data2[0].status === "fulfilled" ? data2[0].value.map((row, i) => Object.assign(depositValue,{[row.id] : row})) : [];

    // console.log(depositValue)

    data = data.map(row=>{
      if(depositValue[row.agreement_id])
      {
        row.old_deposit = depositValue[row.agreement_id].old_deposit
        row.new_amount = depositValue[row.agreement_id].new_amount
      }
      return row} )

    // data.filter((row)=>row.renewal_status === "Renewal Status")


    return res.send({ success: true, agreement: data });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};


const get_all_agreements_approved = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

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
            "users.name as buh",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*",
            "landlords.percentage",
            "landlords.utr_number"
          )
          .where("op_id", "=", row.id)
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users", "agreements.buh_id", "=", "users.id")
          // .join("renewal_deposit","agreements.id", "=", "renewal_deposit.agreement_id")
          .andWhere(cb=>{
            cb.orWhere("agreements.status","=","Deposited");
            cb.orWhere("agreements.status","=","Approved");
           
          })
          .orderBy("agreements.modify_date", "desc");
      })
    );
    let data2 = await Promise.allSettled(
      supervisor.map(async (row) => {
        return await db("agreements")
          .select(
            "agreements.id",
            "renewal_deposit.deposited as old_deposit",
            "renewal_deposit.deposited as new_amount",
          ).join("renewal_deposit","agreements.id", "=", "renewal_deposit.agreement_id")
      })
    );

    data = data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    let depositValue = {}
    data2[0].status === "fulfilled" ? data2[0].value.map((row, i) => Object.assign(depositValue,{[row.id] : row})) : [];

    // console.log(depositValue)

    data = data.map(row=>{
      if(depositValue[row.agreement_id])
      {
        row.old_deposit = depositValue[row.agreement_id].old_deposit
        row.new_amount = depositValue[row.agreement_id].new_amount
      }
      return row} )

    // let ids = [];
    // let agreement = {};

    // data.map((row) => {
    //   if (ids.includes(row.id)) {
    //     agreement = {
    //       ...agreement,
    //       [row.id]: {
    //         ...agreement[row.id],
    //         name: [...agreement[row.id].name, row.name],
    //         sr_manager: supervisor[0].name,
    //       },
    //     };
    //   } else {
    //     ids.push(row.id);
    //     agreement = {
    //       ...agreement,
    //       [row.id]: { ...row, name: [row.name], sr_manager: Sr_names[row.buh_id] },
    //     };
    //   }
    // });

    // console.log('>>>',ids,agreement)

    return res.send({ success: true, agreement: data });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};

//search use by field name
async function finance_agreement_search(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", req.params.id);

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
      .join("users", "agreements.manager_id", "=", "users.id")
      .join("users as srm", "agreements.srm_id", "=", "srm.id")
      .where("op_id", supervisor[0].id)
      .whereNot("agreements.status", "=", "Hold")
      .andWhere((cb) => {
        cb.whereILike("landlords.name", `%${req.query.search}%`);
        cb.orWhereILike("agreements.location", `%${req.query.search}%`);
        cb.orWhereILike("monthlyRent", `%${req.query.search}%`);
        cb.orWhereILike("agreements.code", `%${req.query.search}%`);
        cb.orWhereILike("agreements.address", `%${req.query.search}%`);
      })
      .orderBy("agreements.modify_date", "desc");
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
    req.body.modify_date = new Date();

    const update = await db("agreements")
      .where("id", "=", req.params.id)
      .update(req.body);
    console.log(update);
    if (update === 1) {
      res.send({ success: true, message: "Agreement Update Successfully" });
    } else {
      console.log(update);
      throw new Error({
        success: false,
        message: "Something went wrong please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

async function addutr(req, res) {
  try {

    const update = await db("landlords")
      .where("id", "=", req.params.id)
      .update(req.body);
    console.log(update);
    if (update === 1) {
      res.send({ success: true, message: "Agreement Update Successfully" });
    } else {
      console.log(update);
      throw new Error({
        success: false,
        message: "Something went wrong please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}

//monthly rent get
async function finance_get_monthly_rent(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    let operations_name = {};
    supervisor.map((row) => {
      operations_name = { ...operations_name, [row.id]: row.name };
    });

    console.log(operations_name);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        return await db("monthly_rent")
          .select(
            "monthly_rent.*",
            "users.name as srm_name",
            "Manager.name as manager_name"
          ).where(cb=>{
            cb.orWhere("monthly_rent.status","=","Sent To Finance");
            cb.orWhere("monthly_rent.status","=","Approved By Finance");
            cb.orWhere("monthly_rent.status","=","Sent Back From Finance");
          })
          .andWhere("monthly_rent.op_id", row.id)
          .join("users", "monthly_rent.srm_id", "users.id")
          .join(
            "users as Manager",
            "monthly_rent.manager_id",
            "=",
            "Manager.id"
          ).orderBy("time", "asc")
          .orderBy("rent_date","asc")
          .orderBy("code","asc")
      })
    );

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    console.log(">>up>",data)

    let ids = [];
    let agreement = {};

    data.map((row) => {
      console.log(row);
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id);
        agreement = {
          ...agreement,
          [row.id]: {
            ...row,
            name: [row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, ids, agreement });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Some Error Occured Please Try Again Later.",
      });
  }
}

//monthly rent get
async function finance_get_monthly_rent_paid(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    let operations_name = {};
    supervisor.map((row) => {
      operations_name = { ...operations_name, [row.id]: row.name };
    });

    console.log(operations_name);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        return await db("monthly_rent")
          .select(
            "monthly_rent.*",
            "users.name as srm_name",
            "Manager.name as manager_name"
          ).where(cb=>{
            cb.orWhere("monthly_rent.status","=","Paid");
          })
          .andWhere("op_id", row.id)
          .join("users", "monthly_rent.srm_id", "users.id")
          .join(
            "users as Manager",
            "monthly_rent.manager_id",
            "=",
            "Manager.id"
          ).orderBy("time", "asc")
          .orderBy("rent_date","asc")
          .orderBy("code","asc")
      })
    );
    console.log(">>up>",data)

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    

    let ids = [];
    let agreement = {};

    data.map((row) => {
      console.log(row);
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id);
        agreement = {
          ...agreement,
          [row.id]: {
            ...row,
            name: [row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, ids, agreement });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Some Error Occured Please Try Again Later.",
      });
  }
}

// add the all recovery slabs for the respective agreement

async function getRecoveryLog(req, res) {
  try {
    if (req.query.id) {
      console.log(req.query.id);
      let response = await db("recovery_logs")
        .select("*")
        .where("agreement_id", req.query.id);
      let balance = await db("recovery")
        .select("balanceDeposit")
        .where("agreement_id", req.query.id);

      if (response) {
        console.log(response);
        return res.send({ history: response, balance: balance[0] });
      }
    } else {
      return res.status(204).send("No data found.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

// adding the recovery logs amount
async function insertRecoveryLog(req, res) {
  try {
    if (req.body) {
      let response = await db("recovery_logs").insert(req.body);

      if (response) {
        return res.send("Data added successfully.");
      }
    } else {
      return res.status(204).send("No data found.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

//dashboard  item
async function get_dashboard_dats_finance(req, res) {
  try {
    console.log(req.params.id);
    let status = await db("users")
      .select("users.id", "agreements.status")

      .join("agreements", "agreements.op_id", "=", "users.id")
      .where("supervisor", "=", req.params.id);

    //  console.log(status)

    let meta = {
      totalAgreement: 0,
      Pending: 0,
      Send_Back: 0,
      Approved: 0,
      Renewal: 0,
    };
    console.log(status);

    if (status) {
      status.map((row) => {
        meta.totalAgreement += 1;
        switch(row.status)
        {
          case "Sent Back From Finance" : 
          meta.Send_Back += 1;
          break;
          case "Approved" : 
          meta.Approved += 1;
          break;
          case "Deposited" : 
          meta.Approved += 1;
          break;
          case "Sent To Finance" :
          meta.Pending += 1;
          break;
          case "Sent To Finance Team" :
          meta.Pending += 1;
          break;
          default:
           break
        }
      });
    }

    console.log(status);

    res.send(meta);
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
  }
}

const get_agreements_by_id = async (req, res) => {
  try {
    let data = await db("agreements")
      .select(
        "users.name as buh",
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id as landlords_id",
        "agreements.*",
        "landlords.*"
      )
      .andWhere("landlords.id", "=", req.params.id)
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .join("users", "agreements.buh_id", "=", "users.id")
      .orderBy("agreements.modify_date", "desc");

    console.log(">>>data", data);

    return res.send({ success: true, agreement: data });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};

//in process monthly payment
async function get_monthly_search (req,res){
try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.query.id);

    if (supervisor.length === 0) throw new Error();

    let operations_name = {};
    supervisor.map((row) => {
      operations_name = { ...operations_name, [row.id]: row.name };
    });

    console.log(operations_name);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        return await db("monthly_rent")
          .select(
            "monthly_rent.*",
            "users.name as srm_name",
            "Manager.name as manager_name"
          )
          .where(cb=>{
                    cb.orWhere("monthly_rent.status","=","Sent To Finance");
                    cb.orWhere("monthly_rent.status","=","Approved By Finance");
                    cb.orWhere("monthly_rent.status","=","Sent Back From Finance");
                  })
                  .andWhere((cb) => {
                    cb.whereILike("landlord_name", `%${req.query.search}%`);
                    cb.orWhereILike("monthly_rent.location", `%${req.query.search}%`);
                    cb.orWhereILike("	monthly_rent.gst", `%${req.query.search}%`);
                    cb.orWhereILike("monthly_rent.code", `%${req.query.search}%`);
                    cb.orWhereILike("monthly_rent.status", `%${req.query.search}%`);
                  })
          .andWhere("op_id", row.id)
          .join("users", "monthly_rent.srm_id", "users.id")
          .join(
            "users as Manager",
            "monthly_rent.manager_id",
            "=",
            "Manager.id"
          ).orderBy("time", "asc")
          .orderBy("rent_date","asc")
          .orderBy("code","asc")
      })
    );

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    console.log(">>up>",data)

    let ids = [];
    let agreement = {};

    data.map((row) => {
      console.log(row);
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            name: [...agreement[row.id].name, row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      } else {
        ids.push(row.id);
        console.log(">>>>>", row.manager_id);
        agreement = {
          ...agreement,
          [row.id]: {
            ...row,
            name: [row.name],
            operations_name: operations_name[row.op_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, ids, agreement });
  } 
   catch (error) {
    console.log(error)
    return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
  }
}

//paid monthly rent search
async function get_monthly_search_paid (req,res){
  try {
      const supervisor = await db("users")
        .select("*")
        .where("supervisor", "=", req.query.id);
  
      if (supervisor.length === 0) throw new Error();
  
      let operations_name = {};
      supervisor.map((row) => {
        operations_name = { ...operations_name, [row.id]: row.name };
      });
  
      console.log(operations_name);
  
      let data = await Promise.allSettled(
        supervisor.map(async (row) => {
          return await db("monthly_rent")
            .select(
              "monthly_rent.*",
              "users.name as srm_name",
              "Manager.name as manager_name"
            )
            .where(cb=>{
                      cb.orWhere("monthly_rent.status","=","Paid");
                    })
                    .andWhere((cb) => {
                      cb.whereILike("landlord_name", `%${req.query.search}%`);
                      cb.orWhereILike("monthly_rent.location", `%${req.query.search}%`);
                      cb.orWhereILike("	monthly_rent.gst", `%${req.query.search}%`);
                      cb.orWhereILike("monthly_rent.code", `%${req.query.search}%`);
                      cb.orWhereILike("monthly_rent.status", `%${req.query.search}%`);
                    })
            .andWhere("op_id", row.id)
            .join("users", "monthly_rent.srm_id", "users.id")
            .join(
              "users as Manager",
              "monthly_rent.manager_id",
              "=",
              "Manager.id"
            ).orderBy("time", "asc")
            .orderBy("rent_date","asc")
            .orderBy("code","asc")
        })
      );
  
      data =
        data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];
  
      console.log(">>up>",data)
  
      let ids = [];
      let agreement = {};
  
      data.map((row) => {
        console.log(row);
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              operations_name: operations_name[row.op_id],
            },
          };
        } else {
          ids.push(row.id);
          console.log(">>>>>", row.manager_id);
          agreement = {
            ...agreement,
            [row.id]: {
              ...row,
              name: [row.name],
              operations_name: operations_name[row.op_id],
            },
          };
        }
      });
  
      console.log(">>>", ids, agreement);
  
      return res.send({ success: true, ids, agreement });
    } 
     catch (error) {
      console.log(error)
      return res.status(500).send({success:false,message:"Some Error Occured!! Please Try Again Later."})
    }
  }


// convert monthly rent to paid 
async function convert_to_paid(req,res){
  try {
    if(!req.query.code) return res.status(203).send("Agreement Code is missing !!!")

    const listUnpaid =await  db('monthly_rent').select("id").where(cb=>{
      cb.andWhere("code","=",req.query.code)
      cb.andWhereNot("status","Paid")
    });

    console.log(">>>",listUnpaid)

    if(listUnpaid.length < 1) return res.send({message : "No Pending Records !!!"})

    Promise.allSettled((listUnpaid).map(async(row)=>{
      return await db('monthly_rent').where("id","=",row.id).update({status:"Paid", processed_by : "Settled by deposit"})
    }))
    .then(()=>{
      return res.send({message : "Status convert to paid."})
    })
    .catch(()=>{
      return res.status(500).send({message : "Some Issues In APIs"})
    })
  } catch (error) {
    
  }
}

module.exports = {
  convert_to_paid,
  addutr,
  get_agreements_by_id,
  get_dashboard_dats_finance,
  getAllAgreement,
  finance_agreement_search,
  updateAgreement,
  finance_get_monthly_rent,
  insertRecoveryLog,
  getRecoveryLog,
  get_all_agreements_inProcess,
  get_all_agreements_approved,
  finance_get_monthly_rent_paid,
  get_monthly_search,
  get_monthly_search_paid
};
