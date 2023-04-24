const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);
    console.log(">>>", supervisor[0].id);

    // console.log(sr_manager)
    // for getting the name for Sr manager
    let Sr_names = {};
    supervisor.map((row) => {
      Sr_names = { ...Sr_names, [row.id]: row.name };
    });

    console.log(supervisor);

    let data = await Promise.allSettled(
      supervisor.map(async (row) => {
        // console.log(row);
        return await db("agreements")
          .select(
            "users.name as manager_name",
            "landlords.name",
            "landlords.agreement_id",
            "landlords.id as landlords",
            "agreements.*",
           
          )
          .join("landlords", "agreements.id", "=", "landlords.agreement_id")
          .join("users","agreements.manager_id","=","users.id")
          .where("srm_id", row.id).orderBy('agreements.modify_date',"desc");
      })
    );
    // data = data.map((row)=>row.status === 'fulfilled' && row.value[0])
    data =
      data[0].status === "fulfilled" ? data[0].value.map((row, i) => row) : [];

    // console.log(">>>", data);

    let ids = [];
    let agreement = {};

  data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              sr_manager: Sr_names[row.srm_id]
            },
          };
        } else {
          ids.push(row.id);
          agreement = {
            ...agreement,
            [row.id]: {
              ...row,
              name: [row.name],
              sr_manager: Sr_names[row.srm_id]
            },
          };
        
      }
      
    // console.log("lineno 73",ids,agreement)
  });
  // console.log("lineno 75",ids,agreement)

  return res.send({success:true,ids,agreement})
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

module.exports = { getAllAgreement, user_search_buh, updateAgreement };
