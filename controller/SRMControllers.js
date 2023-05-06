const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    // for getting the name for Sr manager
    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("agreements")
          .select(
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id ",
            "agreements.*"
          )
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere(cb=>{
            cb.orWhere("status","=","Sent To Sr Manager");
            cb.orWhere("status","=","Sent To BUH");
            cb.orWhere("status","=","Sent To Operations");
            cb.orWhere("status","=","Sent To Finance Team");
            cb.orWhere("status","=","Terminated By Manager");
            cb.orWhere("status","=","Terminated By Sr Manager")
          })
          .orderBy("agreements.modify_date", "desc");
      })
    );

    // console.log(">>up>",data)
    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, agreement, ids });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};

// approved all agreemants
const getAllApprovedAgreements = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    // for getting the name for Sr manager
    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("agreements")
          .select(
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id ",
            "agreements.*"
          )
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere(cb=>{
            cb.orWhere("status","=","Approved");
            cb.orWhere("status","=","Deposited");
          })
          .orderBy("agreements.modify_date", "desc");
      })
    );

    // console.log(">>up>",data)
    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, agreement, ids });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
};

//get total agreements
const get_total_agreements = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    // for getting the name for Sr manager
    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("agreements")
          .select(
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id ",
            "agreements.*"
          )
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .orderBy("agreements.modify_date", "desc");
      })
    );

    // console.log(">>up>",data)
    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

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
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);
    // for getting the name for Sr manager

    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("agreements")
          .select(
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id ",
            "agreements.*"
          )
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .where("manager_id", "=", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere((cb) => {
            cb.whereILike("name", `%${req.body.name}%`);
            cb.orWhereILike("location", `%${req.body.name}%`);
            cb.orWhereILike("monthlyRent", `%${req.body.name}%`);
            cb.orWhereILike("code", `%${req.body.name}%`);
            cb.orWhereILike("address", `%${req.body.name}%`);
          }).orderBy('agreements.modify_date',"desc");
      })
    );

    // console.log(">>up>",data)
    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

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
            manager: supervisor[0].name,
          },
        };
      } else {
        ids.push(row.id);
        agreement = {
          ...agreement,
          [row.id]: {
            ...row,
            name: [row.name],
            manager: manager_name[row.srm_id],
          },
        };
      }
    });

    console.log(">>>", ids, agreement);

    return res.send({ success: true, agreement, ids });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}

//month rent Show list get all
async function srm_get_monthly_rent(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("monthly_rent")
          .select("*")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere(cb=>{
            cb.orWhere('status',"=","Sent To Sr Manager");
            cb.orWhere('status',"=","Pending");
            cb.orWhere('status',"=","Sent To Operations");
            cb.orWhere('status',"=","Sent To Finance ");
          })
          .orderBy("id", "desc");
      })
    );

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    console.log(">>up>", data);

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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
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
        message: "Some Error Occured!! Please Try Again Later.",
      });
  }
}

//approved agreements
async function srm_get_monthly_rent_paid(req, res) {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);

    if (supervisor.length === 0) throw new Error();

    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("monthly_rent")
          .select("*")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere(cb=>{
            cb.orWhere('status',"=","Approved");
            cb.orWhere('status',"=","Paid");
          })
          .orderBy("id", "desc");
      })
    );

    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    console.log(">>up>", data);

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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
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
        message: "Some Error Occured!! Please Try Again Later.",
      });
  }
}

//monthy rent by id
async function srm_get_monthly_rent_id(req, res) {
  try {
    const data = await db("monthly_rent")
      .select("*")
      .where("id", "=", req.params.id);

    console.log(data);

    if (data.length === 0) {
      return res
        .status(404)
        .send({
          success: false,
          message: "Some Error Occured!! Please Try Again Later.",
        });
    } else {
      return res.send({ succes: true, data });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Some Error Occured!! Please Try Again Later.",
      });
  }
}

//get renewal list
async function get_renewal_srm(req, res) {
  try {
    console.log(req.params.id);
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .where("agreements.srm_id", "=", req.params.id)
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .andWhereNot("renewal_status", "=", '""')
      .andWhereNot("renewal_status", "=", "Pending For Renewal")
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
          },
        };
      } else {
        ids.push(row.id);
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name] } };
      }
    });
    //console.log(agreement);

    // //console.log(data)

    res.send({ success: true, agreement, ids: ids });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
}

async function get_search_renewal_srm(req, res) {
  try {
    console.log(req.query.search);
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .where("agreements.srm_id", "=", req.params.id)
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .andWhereNot("renewal_status", "=", "null")
      .andWhereNot("renewal_status", "=", "Pending For Renewal")
      .andWhere((cb) => {
        cb.whereILike("name", `%${req.query.search}%`);
        cb.orWhereILike("location", `%${req.query.search}%`);
        cb.orWhereILike("monthlyRent", `%${req.query.search}%`);
        cb.orWhereILike("code", `%${req.query.search}%`);
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
          },
        };
      } else {
        ids.push(row.id);
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name] } };
      }
    });
    //console.log(agreement);

    // //console.log(data)

    res.send({ success: true, agreement, ids: ids });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "something Went Wrong please try again later",
    });
  }
}

//search in onthly rent in process payment
async function get_search_monthlyrent_srm(req, res) {
  try {
    console.log(">>>body>>",req.query)
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.query.id);
 
      console.log(supervisor)

    if (supervisor.length === 0) throw new Error();

    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });
    
    console.log(">>>>",supervisor)
    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("monthly_rent")
          .select("*")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
         
          .andWhere(cb=>{
            cb.orWhere("status","=","Sent To Sr Manager");
            cb.orWhere("status","=","Sent To Operations");
            cb.orWhere("status","=","Sent To Finance");
            cb.orWhere("status","=","Pending");
            cb.orWhere("status","=","Sent Back From Finance");
            cb.orWhere("status","=","Sent Back From Operations");
            cb.orWhere("status","=","Sent Back From Sr Manager");
            cb.orWhere("status","=","Hold");
          })
          .andWhere((cb) => {
            cb.whereILike("landlord_name", `%${req.query.search}%`);
            cb.orWhereILike("location", `%${req.query.search}%`);
            cb.orWhereILike("	gst", `%${req.query.search}%`);
            cb.orWhereILike("code", `%${req.query.search}%`);
            cb.orWhereILike("status", `%${req.query.search}%`);
          })
          .orderBy("id", "desc");
      })
    );

    console.log(">>up>", data);
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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
          },
        };
      }
    });

    console.log(">search>>", ids, agreement);

    return res.send({ success: true, ids, agreement });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Some Error Occured!! Please Try Again Later.",
      });
  }
}

//searcgh in monthly rent paid rent
async function get_search_monthlyrent_srm_paid(req, res) {
  try {
    console.log(">>>body>>",req.query)
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.query.id);
 
      console.log(supervisor)

    if (supervisor.length === 0) throw new Error();

    let manager_name = {};
    supervisor.map((row) => {
      manager_name = { ...manager_name, [row.id]: row.name };
    });
    
    console.log(">>>>",supervisor)
    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        console.log(row.id);
        return await db("monthly_rent")
          .select("*")
          .where("manager_id", row.id)
          .whereNot("status", "=", "Hold")
          .andWhere((cb) => {
            cb.whereILike("landlord_name", `%${req.query.search}%`);
            cb.orWhereILike("location", `%${req.query.search}%`);
            cb.orWhereILike("monthly_rent", `%${req.query.search}%`);
            cb.orWhereILike("code", `%${req.query.search}%`);
            cb.orWhereILike("gst", `%${req.query.search}%`);
          })
          .andWhere(cb=>{
            cb.orWhere("status","=","Paid");
          })
          .orderBy("id", "desc");
      })
    );

    console.log(">>up>", data);
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
            manager: manager_name[row.manager_id],
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
            manager: manager_name[row.manager_id],
          },
        };
      }
    });

    console.log(">search>>", ids, agreement);

    return res.send({ success: true, ids, agreement });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Some Error Occured!! Please Try Again Later.",
      });
  }
}


//dashboard  item
async function get_dashboard_data(req, res) {
  try {

    let status = await db("users").select('users.id',"agreements.status")
    .where("supervisor","=",req.params.id)
    .join("agreements","agreements.manager_id","=","users.id")
    
    // let  = await db("agreements").select("status");

    let meta = {
      totalAgreement: 0,
      Pending: 0,
      Send_Back: 0,
      Approved: 0,
      Renewal: 0,
    };
    // console.log(status)

    if (status) {
      status.map((row) => {
        // console.log()
        meta.totalAgreement += 1;

        switch(row.status)
        {
          case "Sent Back From Sr Manager" : 
          meta.Send_Back += 1;
          break;
          case "Sent To Sr Manager" : 
          meta.Pending += 1;
          break;
          case "Sent To Finance Team" : 
          meta.Approved += 1;
          break;
          case "Sent To BHU" :
          meta.Approved += 1;
          break;
          case "Sent To Operations" :
          meta.Approved += 1;
          break;
          case "Deposited" : 
          meta.Approved += 1;
          break;
          default:
           break
        }
      });
    }

    console.log(meta)

    res.send(meta);
  } catch (err) {
    console.log(err)
    res.status(500).send("something went wrong");
  }
}

module.exports = {
  get_search_monthlyrent_srm,
  get_search_renewal_srm,
  getAllAgreement,
  user_search_srmanager,
  srm_get_monthly_rent,
  srm_get_monthly_rent_id,
  get_renewal_srm,
  get_dashboard_data,
  getAllApprovedAgreements,
  srm_get_monthly_rent_paid,
  get_total_agreements,
  get_search_monthlyrent_srm_paid
};
