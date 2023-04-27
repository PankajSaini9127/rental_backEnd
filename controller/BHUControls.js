const db = require("../data/db");

const getAllAgreement = async (req, res) => {
  try {
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", "=", req.params.id);
    // console.log(">>>", supervisor[0].id);

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
   console.log(req.query.search)
    const supervisor = await db("users")
      .select("*")
      .where("supervisor", req.params.id);

    const data = await db("agreements")
      .select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("srm_id", supervisor[0].id)
      .whereNot("status", "=", "Hold")
      .andWhere((cb) => {
        cb.whereILike("name", `%${req.query.search}%`);
        cb.orWhereILike("location", `%${req.query.search}%`);
        cb.orWhereILike("monthlyRent", `%${req.query.search}%`);
        cb.orWhereILike("code", `%${req.query.search}%`);
        cb.orWhereILike("agreements.address", `%${req.query.search}%`);
      })
      .orderBy('agreements.modify_date',"desc")
    

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
    req.body.modify_date = new Date()
    console.log(">>> Test BUH Fire >>> ",req.body)
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


async function getAgreementByIdBuh(req, res) {
  try {

    console.log(req.params.id)
    const data = await db("agreements")
      .select("landlords.*", "agreements.*", "landlords.id as landlord_id")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("agreement_id", req.params.id);
      

    let ids = [];
    let agreement = {};
    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          landlord: [
            ...agreement.landlord,
            {
              landlord_id: row.landlord_id,
              name: row.name,
              percentageShare: row.percentageShare,
              leeseName: row.leeseName,
              aadharNo: row.aadharNo,
              // area: row.area,
              panNo: row.panNo,
              gstNo: row.gstNo,
              mobileNo: row.mobileNo,
              gst: row.gst,
              cheque: row.cheque,
              branchName: row.branchName,
              alternateMobile: row.alternateMobile,
              email: row.email,
              bankName: row.bankName,
              benificiaryName: row.benificiaryName,
              accountNo: row.accountNo,
              ifscCode: row.ifscCode,
              agreement_id: row.agreement_id,
              aadhar_card: row.aadhar_card,
              pan_card: row.pan_card,
              gst: row.gst,
            },
          ],
        };
      } else {
        ids.push(row.id);

        agreement = {
          ...row,
          landlord: [
            {
              landlord_id: row.landlord_id,
              name: row.name,
              percentageShare: row.percentageShare,
              leeseName: row.leeseName,
              aadharNo: row.aadharNo,
              panNo: row.panNo,
              gstNo: row.gstNo,
              gst: row.gst,
              cheque: row.cheque,
              // area: row.area,
              branchName: row.branchName,
              mobileNo: row.mobileNo,
              alternateMobile: row.alternateMobile,
              email: row.email,
              bankName: row.bankName,
              benificiaryName: row.benificiaryName,
              accountNo: row.accountNo,
              ifscCode: row.ifscCode,
              agreement_id: row.agreement_id,
              aadhar_card: row.aadhar_card,
              pan_card: row.pan_card,
              gst: row.gst,
            },
          ],
        };
      }
    });
    // //console.log(agreement);

    return res.status(200).send(agreement);
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}

module.exports = {getAgreementByIdBuh, getAllAgreement, user_search_buh, updateAgreement };
