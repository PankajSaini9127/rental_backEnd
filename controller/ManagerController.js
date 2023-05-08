require("dotenv").config();
const { select } = require("../data/db");
const db = require("../data/db");
const moment = require('moment')

const newAgreement = async (req, res) => {
  try {
    console.log(req.body)
    req.body.modify_date = new Date()
    const agreement = await db("agreements").insert(req.body);
    console.log(agreement);

    if (agreement.length == 1) {
      res.status(201).send({
        success: true,
        message: "Agreement Submit Successfully",
        agreement,
      });
    } else {
      throw new Error({
        success: false,
        message: "Something went wrong Please",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong Please", error });
  }
};

async function add_landlord(req, res) {
  // //console.log(req.body)
  try {
    const lanloard = await db("landlords").insert(req.body);

    if (lanloard) {
      res.send({ message: "Landlord Added." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !!!" });
  }
}


//in process agreements
const getAllAgreement = async (req, res) => {
  try {
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "landlords.utr_number",
        "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .orderBy("agreements.modify_date", "desc")
      .where("manager_id","=",req.params.manager_id);


    let ids = [];
    let agreement = {};
    data.map((row) => {
      if(row.status === "Sent To Sr Manager" ||
      row.status === "Sent To BUH" ||
      row.status === "Sent To Operations" ||
      row.status === "Sent To Finance Team" ||
      row.status === "Approved" ||
      row.status === "Hold"  ||
      row.status === "Sent Back From Sr Manager" || 
      row.status === "Sent Back From BUH" ||
      row.status === "Sent Back From Operations" ||
      row.status === "Sent Back From Finance Team" ||
      row.status === "Terminated By Manager"||
      row.status === "Sent Back From Sr Manager Termination"||
      row.status === "Sent Back From Operations Termination" ||
      row.status === "Sent Back From Finance Team Termination"){
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
      }
     
    });
    //console.log(agreement);

    // //console.log(data)

    res.send({ success: true, agreement, ids: ids });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Something Went Wrong please try again later",
    });
  }
};

// approved agreements
async function get_all_approved_ag (req,res){
  try {
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "landlords.utr_number",
        "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .orderBy("agreements.modify_date", "desc")
      .where("manager_id","=",req.params.manager_id);

      console.log(data)
      
    let ids = [];
    let agreement = {};
    data.map((row) => {
      if(
      row.status === "Deposited"  ){
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
      }
     
    });
    //console.log(agreement);

    // //console.log(data)

    res.send({ success: true, agreement, ids: ids });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Something Went Wrong please try again later",
    });
  }
}


//get all agreements 
async function get_all__ag (req,res){
  try {
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "landlords.utr_number",
        "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .orderBy("agreements.modify_date", "desc")
      .where("manager_id","=",req.params.manager_id);

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
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
      }
     
    );
    //console.log(agreement);

    // //console.log(data)

    res.send({ success: true, agreement, ids: ids });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Something Went Wrong please try again later",
    });
  }
}


const get_tenure = async (req, res) => {
  try {
    var month = new Date(Date.now());

    m11.setMonth(m11.getMonth() - 10);

    //console.log("11m>>>", m11);

    var y3 = new Date(Date.now());
    y3.setMonth(y3.getMonth() - 10 * 3);
    //console.log("y3>>>", y3);

    var y5 = new Date(Date.now());
    y5.setMonth(y5.getMonth() - 10 * 5);
    //console.log("y5>>>", y5);

    var tenure11Month = await db
      .from("agreements")
      .select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .orderBy("agreements.time", "desc");
    tenure11Month = tenure11Month.map((row, i) => {
      switch (row.tenure) {
        case "11 Month":
          var m11 = new Date(row.time);
          m11.setMonth(m11.getMonth() - 10);
          return row.time >= m11 && row;

        case "3 Year":
          var y3 = new Date(Date.now());
          y3.setMonth(y3.getMonth() - 10 * 3);
          return row.time >= y3 && row;

        case "5 Year":
          var y5 = new Date(Date.now());
          y5.setMonth(y5.getMonth() - 10 * 5);
          return row.time >= y5 && row;

        default:
          return row;
      }
    });
    //console.log(tenure11Month);
    return res.send({ success: true, renewal: tenure11Month });
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
};

const updateAgreement = async (req, res) => {
  try {
    console.log(">>>>", req.body);

    req.body.modify_date = new Date()

    const update = await db("agreements")
      .where("id", "=", req.params.id)
      .update(req.body);
    console.log(req.params.id);
    if (update === 1) {
      return res.send({
        success: true,
        message: "Agreement Update Successfully",
      });
    } else {
      throw new Error({ success:false, message: "Something went wrong please try again later" })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
};

const deleteAgreement = async (req, res) => {
  try {
    //console.log(req.params.id);
    const result = await db("agreements").where("id", req.params.id).del();
    const landlords = await db("landlords")
      .where("agreement_id", req.params.id)
      .del();
    //console.log(result, landlords);
    if (result === 1 && landlords === 1) {
      res.status(202).send({ success: true, message: "Delete Successful" });
    } else {
      res.send({
        success: false,
        message: "Something went Wrong Please try again later",
      });
    }
  } catch (error) {
    //console.log(error);
    res.send({
      success: false,
      message: "Something went Wrong Please try again later",
    });
  }
};

const uploadDoc = async (req, res) => {
  try {
    if (req.files["photo"]) {
      res.send({
        link: `${process.env.IMAGE_LINK_O + req.files["photo"][0].path}`,
        message: "Document Uploaded",
      });
    } else {
      res.status(203).send({ message: "Pleae Provide the document." });
    }
  } catch (error) {
    //console.log(error);
    res.send({ message: "Something went Wrong !!!" });
  }
};

async function get_monthly_rent(req, res) {
  try {
    var monthly_rent = await db
      .from("agreements")
      .select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .andWhere("agreements.id", "=", req.params.id);

    var getDaysInMonth = function (month, year) {
      return new Date(year, month, 0).getDate();
    };

    let finalData = [];

       monthly_rent = monthly_rent.map((row, i) => {
      
      console.log("RSD >>> ", row.rent_start_date);
      var rent_date = new Date(row.rent_start_date);

      const totalDaysInMonth = getDaysInMonth(
        rent_date.getMonth() + 1,
        rent_date.getFullYear()
      );
      // console.log("rent>>>", row);


      const restDays = totalDaysInMonth - rent_date.getDate();

      console.log("rent>>>", row.monthlyRent / totalDaysInMonth);
      console.log(
        totalDaysInMonth,
        restDays,
        row.monthlyRent,
        rent_date.getDate()
      );

      // calculating the final amount
      const finalAmount = (((row.monthlyRent / totalDaysInMonth) * (restDays+1))/100)*parseInt(row.percentage) 
      const finalAmountForFullMonth = (row.monthlyRent/100)*parseInt(row.percentage) 

      // this code will also add the field for next month 

      const todayMoment = moment()
      const tomorrowMoment = todayMoment.clone().add(1,'month')
      let RentDate = new Date(row.rent_start_date).getUTCDate()


      const nextMonthSlab = {
        monthly_rent : row.monthlyRent,
        code : row.code,
        location  : row.location ,
        gst  : row.gstNo ,
        utr_no  : row.utr_number ,
        landlord_name: row.name,
        status: row.status,
        share: row.percentage,
        rent_amount: finalAmountForFullMonth,
        rent_date : tomorrowMoment
      }

      // current Slab
      row = {
        monthly_rent : row.monthlyRent,
        code : row.code,
        location  : row.location ,
        gst  : row.gstNo ,
        utr_no  : row.utr_number ,
        landlord_name: row.name,
        status: row.status,
        share: row.percentage,
        rent_amount: finalAmount,
        rent_date : row.rent_start_date,
      };

      finalData.push(row);

      if(RentDate > 15)
      finalData.push(nextMonthSlab);
 
    });

    console.log(finalData)
    return res.send({ success: true, monthly_rent: finalData });
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}

async function getStateList(req, res) {
  try {
    if (req.query.search) {
      let { search } = req.query;
      let stateList = await db
        .table("state")
        .select("name", "id")
        .whereILike("name", `%${search}%`)
        .limit(10);
      // let stateList = await db.table('state').select('name','id').whereILike('name',`%${search}%`).limit(10);

      if (stateList) {
        return res.send(stateList);
      }
    } else return res.send([]);
  } catch (error) {
    //console.log(error);
    res.status(500).send("Error");
  }
}

async function getCityList(req, res) {
  try {
    if (req.query.search) {
      let { search } = req.query;
      let cityList = await db
        .table("city")
        .select("city", "state_id")
        .where("state_id", `${search}`);

      if (cityList) {
        return res.send(cityList);
      }
    } else return res.send([]);
  } catch (error) {
    //console.log(error);
    res.status(500).send("Error");
  }
}

async function detailsAgreement(req, res) {
  try {
    //console.log(req.query.id);
    const agreement = await db("agreements").join(
      "landlords",
      "agreements.id",
      "=",
      "landlords.agreement_id"
    );

    agreement.map((row, i) => {
      //console.log(row.id, req.params.id);
      if (row.agreement_id == req.params.id) {
        return res.send(row);
      }
    });

    return res.send(agreement);
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}

async function getAgreementById(req, res) {
  try {
    const data = await db("agreements")
      .select("landlords.*", "agreements.*", "landlords.id as landlord_id")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("agreement_id", req.query.id);

      const listUnpaidRow = await db("monthly_rent").select("rent_amount","rent_date","status").where(cb=>{
        cb.andWhere("agreement_id",req.query.id)
        cb.andWhereNot("status","Paid")
      })
    // //console.log(data);

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

    return res.status(200).send({agreement,listUnpaidRow});
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}
//get all agreement value
async function get_old_agreement(req, res) {
  try {
    const data = await db("agreements")
      .select("landlords.*", "agreements.*", "landlords.id as landlord_id")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .whereNull("type")
      .where("code","=", req.query.code)

      console.log(data)


      let ids = [];
      let agreement = {};
      data.map((row) => {
        
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              landlord_id: [...agreement[row.id].landlord_id, row.landlord_id],
              name: [...agreement[row.id].name, row.name],
              leeseName: [...agreement[row.id].leeseName, row.leeseName],
              branchName: [...agreement[row.id].branchName, row.branchName],
              aadharNo: [...agreement[row.id].aadharNo, row.aadharNo],
              panNo: [...agreement[row.id].panNo, row.panNo],
              gstNo: [...agreement[row.id].gstNo, row.gstNo],
              mobileNo: [...agreement[row.id].mobileNo, row.mobileNo],
              cheque: [...agreement[row.id].cheque, row.cheque],
              gst: [...agreement[row.id].gst, row.gst],
              alternateMobile: [
                ...agreement[row.id].alternateMobile,
                row.alternateMobile,
              ],
              email: [...agreement[row.id].email, row.email],
              bankName: [...agreement[row.id].bankName, row.bankName],
              benificiaryName: [
                ...agreement[row.id].benificiaryName,
                row.benificiaryName,
              ],
              accountNo: [...agreement[row.id].accountNo, row.accountNo],
              ifscCode: [...agreement[row.id].ifscCode, row.ifscCode],
              agreement_id: [...agreement[row.id].agreement_id, row.agreement_id],
              aadhar_card: [...agreement[row.id].aadhar_card, row.aadhar_card],
              pan_card: [...agreement[row.id].pan_card, row.pan_card],
              percentage: [...agreement[row.id].percentage, row.percentage],
              utr_number: [...agreement[row.id].utr_number, row.utr_number],
              payment_date:  [...agreement[row.id].payment_date, row.payment_date]
            },
          };
        } else {
          ids.push(row.id);
          agreement = {
            ...agreement,
            [row.id]: {
              ...row,
              landlord_id: [row.landlord_id],
              name: [row.name],
              percentage: [row.percentage],
              leeseName: [row.leeseName],
              state: [row.state],
              city: [row.city],
              branchName: [row.branchName],
              location: [row.location],
              pincode: [row.pincode],
              address: [row.address],
              aadharNo: [row.aadharNo],
              panNo: [row.panNo],
              gstNo: [row.gstNo],
              gst: [row.gst],
              cheque: [row.cheque],
              mobileNo: [row.mobileNo],
              alternateMobile: [row.alternateMobile],
              email: [row.email],
              bankName: [row.bankName],
              benificiaryName: [row.benificiaryName],
              accountNo: [row.accountNo],
              ifscCode: [row.ifscCode],
              agreement_id: [row.agreement_id],
              aadhar_card: [row.aadhar_card],
              pan_card: [row.pan_card],
              utr_number: [row.utr_number],
              payment_date: [row.payment_date],
            },
          };
        }
      });
  
      return res.status(200).send({success:true, agreement, ids });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}


async function editAgreement(req, res) {
  try {
    //console.log(req.body)

    let {
      id,
      pincode,
      state,
      address,
      location,
      city,
      lockInYear,
      monthlyRent,
      noticePeriod,
      yearlyIncrement,
      deposit,
      gst_certificate,
      draft_agreement,
      electricity_bill,
      poa,
      maintaince_bill,
      cheque,
      tax_receipt,
      noc,
      tenure,
      year1,
      year2,
      year3,
      year4,
      year5,
      landlord,
      status,
      area,
      remark,
      assets
    } = req.body;

    let saveAgreement = await db("agreements").where("id", "=", id).update({
      pincode,
      state,
      address,
      location,
      area,
      city,
      lockInYear,
      monthlyRent,
      noticePeriod,
      yearlyIncrement,
      deposit,
      gst_certificate,
      draft_agreement,
      electricity_bill,
      poa,
      maintaince_bill,
      cheque,
      tax_receipt,
      noc,
      tenure,
      year1,
      year2,
      year3,
      year4,
      year5,
      status,
      remark,
      assets,
      modify_date : new Date()      
    });

    //console.log(saveAgreement);

    if (saveAgreement) {
      //console.log(landlord);
      Promise.all(
        landlord.map(async (row, index) => {
          let {
            name,
            percentageShare,
            leeseName,
            aadharNo,
            panNo,
            gstNo,
            mobileNo,
            alternateMobile,
            email,
            bankName,
            benificiaryName,
            accountNo,
            ifscCode,
            agreement_id,
            gst,
            cheque,
            aadhar_card,
            pan_card,
          } = row;
          return await await db("landlords")
            .where("id", "=", row.landlord_id)
            .update({
              name,
              percentageShare,
              aadharNo,
              panNo,
              gstNo,
              mobileNo,
              alternateMobile,
              email,
              bankName,
              benificiaryName,
              accountNo,
              ifscCode,
              agreement_id,
              gst,
              cheque,
              aadhar_card,
              pan_card,
            });
        })
      )
        .then(() => {
          return res.send({ message: "Agreement edited" });
        })
        .catch((err) => {
          //console.log("err=>", err);
          res.status(501).send({ message: "Landloard not updated" });
        });
    } else {
      res.status(501).send({ message: "Landloard not updated" });
    }
  } catch (error) {
    //console.log(error);
    res.status(500).send({ message: "Agreement edited" });
  }
}

//search use by field name
async function user_search_manager(req, res) {
  try {
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where((cb) => {
        cb.whereILike("name", `%${req.body.name}%`);
        cb.orWhereILike("location", `%${req.body.name}%`);
        cb.orWhereILike("monthlyRent", `%${req.body.name}%`);
        cb.orWhereILike("code", `%${req.body.name}%`);
        cb.orWhereILike("address", `%${req.body.name}%`);
      }).orderBy('agreements.modify_date',"desc");

    //console.log(data);

   
    let ids = [];
    let agreement = {};
    data.map((row) => {
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
    
  })

    // //console.log(data)

    res.send({ success: true, agreement, ids });
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}

async function user_search_manager_approved(req, res) {
  try {
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where((cb) => {
        cb.whereILike("name", `%${req.body.name}%`);
        cb.orWhereILike("location", `%${req.body.name}%`);
        cb.orWhereILike("monthlyRent", `%${req.body.name}%`);
        cb.orWhereILike("code", `%${req.body.name}%`);
        cb.orWhereILike("address", `%${req.body.name}%`);
      })
      .andWhere(cb=>{
      cb.orWhere("status","=","Deposited")
      }
      ).orderBy('agreements.modify_date',"desc");

    // console.log(data);

    let ids = [];
    let agreement = {};
    data.map((row) => {
      if(
      row.status === "Deposited"  ){
        if (ids.includes(row.id)) {
          agreement = {
            ...agreement,
            [row.id]: {
              ...agreement[row.id],
              name: [...agreement[row.id].name, row.name],
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
    }
  })

    // //console.log(data)

    res.send({ success: true, agreement, ids });
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}


async function user_search_manager_inProcess(req, res) {
  try {
    const data = await db("agreements")
    .select(
      "landlords.name",
      "landlords.agreement_id",
      "landlords.id",
      "landlords.utr_number",
      "agreements.*"
    )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where((cb) => {
        cb.whereILike("name", `%${req.body.name}%`);
        cb.orWhereILike("location", `%${req.body.name}%`);
        cb.orWhereILike("monthlyRent", `%${req.body.name}%`);
        cb.orWhereILike("code", `%${req.body.name}%`);
        cb.orWhereILike("address", `%${req.body.name}%`);
      })
      .andWhere(cb=>{
      cb.orWhere("status","=","Sent To Sr Manager");
      cb.orWhere("status","=","Sent To Operations");
      cb.orWhere("status","=","Sent To BUH");
      cb.orWhere("status","=","Sent To Finance Team");
      cb.orWhere("status","=","Approved");
      cb.orWhere("status","=","Sent Back From Sr Manager");
      cb.orWhere("status","=","Sent Back From Operations");
      cb.orWhere("status","=","Sent Back From BUH");
      cb.orWhere("status","=","Sent Back From Finance Team");
      }
      ).orderBy('agreements.modify_date',"desc");

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
              utr_number:[...agreement[row.id].utr_number, row.utr_number]
            },
          };
        } else {
          ids.push(row.id);
          agreement = { ...agreement, [row.id]: { ...row, name: [row.name], utr_number: [row.utr_number]  } };
        }
    
  })

    // //console.log(data)

    res.send({ success: true, agreement, ids });
  } catch (error) {
    //console.log(error);
    return res.status(500).send();
  }
}


async function get_agreement_details(req, res) {
  try {
    const data = await db("agreements")
      .select("landlords.*", "agreements.*", "landlords.id as landlord_id")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("agreement_id", req.params.id);

      // console.log(data)

    let ids = [];
    let agreement = {};
    data.map((row) => {
      
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          [row.id]: {
            ...agreement[row.id],
            landlord_id: [...agreement[row.id].landlord_id, row.landlord_id],
            name: [...agreement[row.id].name, row.name],
            leeseName: [...agreement[row.id].leeseName, row.leeseName],
            branchName: [...agreement[row.id].branchName, row.branchName],
            aadharNo: [...agreement[row.id].aadharNo, row.aadharNo],
            panNo: [...agreement[row.id].panNo, row.panNo],
            gstNo: [...agreement[row.id].gstNo, row.gstNo],
            mobileNo: [...agreement[row.id].mobileNo, row.mobileNo],
            cheque: [...agreement[row.id].cheque, row.cheque],
            gst: [...agreement[row.id].gst, row.gst],
            alternateMobile: [
              ...agreement[row.id].alternateMobile,
              row.alternateMobile,
            ],
            email: [...agreement[row.id].email, row.email],
            bankName: [...agreement[row.id].bankName, row.bankName],
            benificiaryName: [
              ...agreement[row.id].benificiaryName,
              row.benificiaryName,
            ],
            accountNo: [...agreement[row.id].accountNo, row.accountNo],
            ifscCode: [...agreement[row.id].ifscCode, row.ifscCode],
            agreement_id: [...agreement[row.id].agreement_id, row.agreement_id],
            aadhar_card: [...agreement[row.id].aadhar_card, row.aadhar_card],
            pan_card: [...agreement[row.id].pan_card, row.pan_card],
            percentage: [...agreement[row.id].percentage, row.percentage],
            utr_number: [...agreement[row.id].utr_number, row.utr_number],
            payment_date:  [...agreement[row.id].payment_date, row.payment_date]
          },
        };
      } else {
        ids.push(row.id);
        agreement = {
          ...agreement,
          [row.id]: {
            ...row,
            landlord_id: [row.landlord_id],
            name: [row.name],
            percentage: [row.percentage],
            leeseName: [row.leeseName],
            state: [row.state],
            city: [row.city],
            branchName: [row.branchName],
            location: [row.location],
            pincode: [row.pincode],
            address: [row.address],
            aadharNo: [row.aadharNo],
            panNo: [row.panNo],
            gstNo: [row.gstNo],
            gst: [row.gst],
            cheque: [row.cheque],
            mobileNo: [row.mobileNo],
            alternateMobile: [row.alternateMobile],
            email: [row.email],
            bankName: [row.bankName],
            benificiaryName: [row.benificiaryName],
            accountNo: [row.accountNo],
            ifscCode: [row.ifscCode],
            agreement_id: [row.agreement_id],
            aadhar_card: [row.aadhar_card],
            pan_card: [row.pan_card],
            utr_number: [row.utr_number],
            payment_date: [row.payment_date],
          },
        };
      }
    });

    return res.status(200).send({success:true, agreement, ids });
  } catch (error) {
    //console.log(error);
    return res.status(500).send({success:false});
  }
}

//send back
async function send_back(req, res) {
  try {
    //console.log(">>>>", req.body, "Send Back");
    // //console.log(req.params.id);
    const update = await db("agreements")
      .where("id", "=", req.params.id)
      .update({ status: req.body.status, remark: req.body.remark, modify_date : new Date()
      });
    //console.log(update);
    if (update === 1) {
      res.send({ success: true, message: "Agreement Update Successfully" });
    } else {
      throw new Error({
        success: false,
        message: "Something went wrong please try again later",
      });
    }
  } catch (error) {
    //console.log(error);
    res.send({
      success: false,
      message: "Something went wrong please try again later",
    });
  }
}

//dashboard  item
async function get_status(req, res) {
  try {
    let status = await db("agreements").select("status");

    let meta = {
      totalAgreement: 0,
      Pending: 0,
      Send_Back: 0,
      Approved: 0,
      Rejected: 0,
      Renewal: 0,
    };
    //console.log(status)

    if (status) {
      status.map((row) => {
        meta.totalAgreement += 1;
        if (row.status === "Sent Back For Rectification") {
          meta.Send_Back += 1;
        } else if (
          row.status === "Sent To Finance Team" ||
          row.status === "Sent To Sr Manager" ||
          row.status === "Sent To BHU" ||
          row.status === "Operations"
        ) {
          meta.Approved += 1;
        } else if ((
          row.status === "Hold"||
          row.status === "Sent Back From Sr Manager"||
          row.status === "Sent Back From BUH"||
          row.status === "Sent Back From Operations"||
          row.status === "Sent Back From Finance Team"
               )) {
          meta.Pending += 1;
        }
      });
    }

    //console.log(meta)

    res.send(meta);
  } catch (err) {
    //console.log(err)
    res.status(500).send("something went wrong");
  }
}

// monthly rental listing APIs
async function getMonthListing(req, res) {
  try {
    if (!req.query.id)
      res.status(203).send({ message: "Please provide the manager ID." });
  } catch (err) {
    //console.log("Error >> ", err);
    return res.status(500).send({ message: "Something Went wrong" });
  }
}

async function set_final_agreement(req, res) {
  try {
    //console.log(">>>Body::",req.body)
    res.send("All Okay ");
  } catch (error) {
    //console.log(error)
    return res.status(500).send({ message: "Something Went Wrong" });
  }
}

async function get_agreement_id_renewal(req,res){
  try {
    const data = await db("agreements")
      .select("landlords.*", "agreements.*", "landlords.id as landlord_id")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where("agreement_id", req.query.id);

    const listUnpaidRow = await db("monthly_rent").select("rent_amount","rent_date","status").where(cb=>{
      cb.andWhere("agreement_id",req.query.id)
      cb.andWhereNot("status","Paid")
    })

    console.log(listUnpaidRow);

    let ids = [];
    let agreement = {};
    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement,
          landlord: [
            ...agreement.landlord,
            {
              // landlord_id: row.landlord_id,
              name: row.name,
              percentage: row.percentage,
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
              // landlord_id: row.landlord_id,
              name: row.name,
              percentage: row.percentage,
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

    return res.status(200).send({agreement,listUnpaidRow});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}


//renewal listing
async function get_renewal_list (req,res){
  try {
    console.log(req.params.id)
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .where("agreements.manager_id","=",req.params.id)
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .andWhereNot("renewal_status","=",'""')
      .andWhereNot("renewal_status","=","Renewed")
      .orderBy("agreements.modify_date", "desc")
      

      console.log(">>>>>>>",data)

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


// get difference old and new status
async function get_deposit_amount (req,res){
  try {
    const deposite = await db("agreements").select('deposit').where("code","=",req.query.code)
    .andWhere("renewal_status","=","Renewed")

     if(deposite.length > 0){
     return res.send({success:true,deposit:deposite})
     }else{
      return res.send({success:false,deposit:0})
     }
  } catch (error) {
    console.log(error)
    return res.status(500).send({success:false})
  }
}



//get search in renewal manager
async function get_search_renewal_manager (req,res)
{
  try {
    console.log(req.params.id)
    const data = await db("agreements")
      .select(
        "landlords.name",
        "landlords.agreement_id",
        "landlords.id",
        "agreements.*"
      )
      .where("agreements.manager_id","=",req.params.id)
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .andWhereNot("renewal_status","=",'""')
      .andWhereNot("renewal_status","=","Renewed")
      .andWhere((cb) => {
        cb.orWhereILike("landlords.name", `%${req.query.search}%`);
        cb.orWhereILike("location", `%${req.query.search}%`);
        cb.orWhereILike("monthlyRent", `%${req.query.search}%`);
        cb.orWhereILike("code", `%${req.query.search}%`);
      })
      .orderBy("agreements.modify_date", "desc")
      

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


// adding the adjustment amount 
async function insertAdjustmentAmount (req,res)
{
  console.log(req.body)
  try {
    if(req.body)
    {
      let response = await db('recovery').insert(req.body)

      console.log(response)

      if(response){
        
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

//get data from recovery
async function get_data_from_recovery (req,res){
  try {
    const data = await db("recovery").select("*").where("agreement_id","=",req.params.id)
    if(data.length>0){
      return res.send({success:true,data})
    }else{
      return res.status(204).send("No Data found")
    }
    } catch (error) {
    console.log(error)
    return res.status(500)
  }
}

//get data from recovery
async function get_data_from_recovery_renewal (req,res){
  // console.log(req.params.id)
  try {
    const data = await db("renewal_deposit").select("*").where("agreement_id","=",req.params.id)
    // console.log(data)
    if(data.length>0){
      
      return res.send({success:true,data:data[0]})
    }else{
      return res.status(204).send("No Data found")
    }
    } catch (error) {
    console.log(error)
    return res.status(500)
  }
}



//get latest modify date
async function get_modify_date (req,res){
  try {
    console.log(req.query.id)

    const data = await db("agreements").select("modify_date").where("id","=",req.query.id)
    console.log(data)
    if(data.length>0){
      return res.send({success:true,modify_date:data[0].modify_date})
    }else{
      return res.status(204).send("No Data found")
    }
    } catch (error) {
    console.log(error)
    return res.status(500)
  }
}


//get latest modify date
async function get_payment_update_date (req,res){
  try {
    console.log(req.query.id)

    const data = await db("monthly_rent").select("update_at").where("id","=",req.query.id)
    console.log(data)
    if(data.length>0){
      return res.send({success:true,modify_date:data[0].update_at})
    }else{
      return res.status(204).send("No Data found")
    }
    } catch (error) {
    console.log(error)
    return res.status(500)
  }
}

// renewal deposit
async function add_renewal_deposit (req,res) {
  try {
    
    if(!req.body)
    {
      return res.status(203).send("Payload Missing !!!")
    }

    let data = null;
    // check if is it already there s
    const check  = await db('renewal_deposit').select("agreement_Id").where("agreement_Id","=",req.body.agreement_id);
    console.log(check)
    if(check.length > 0)
     data  = await db('renewal_deposit').update(req.body).where("agreement_id","=",req.agreement_id);
     else
     data  = await  db('renewal_deposit').insert(req.body);

     console.log(req.body)
    if(data)
    {
      return res.send({message : "Data added successfully !!!"})
    }

  } catch (error) {
    console.log(req.body)

    console.log('error>>>',error)
    return res.status(500).send("Something went wrong !!!")
  }

}

module.exports = {
  get_old_agreement,
  add_renewal_deposit,
  user_search_manager_approved,
  get_payment_update_date,
  get_modify_date,
  insertAdjustmentAmount,
  get_deposit_amount,
  set_final_agreement,
  get_agreement_details,
  user_search_manager,
  editAgreement,
  detailsAgreement,
  getCityList,
  getStateList,
  get_monthly_rent,
  get_tenure,
  newAgreement,
  getAllAgreement,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
  add_landlord,
  uploadDoc,
  send_back,
  get_status,
  get_renewal_list,
  get_agreement_id_renewal,
  get_search_renewal_manager,
  get_data_from_recovery,
  get_all_approved_ag,
  get_all__ag,
  user_search_manager_inProcess,
  get_data_from_recovery_renewal
};

