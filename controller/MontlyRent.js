const db = require("../data/db");

async function get_landlord_id(req, res) {
  try {
    //console.log(req.params.id)
    const landlords = await db("landlords")
      .select("id")
      .where("agreement_id", "=", req.params.id);
    //console.log(landlords)
    res.send({ success: true, landlords_id: landlords });
  } catch (error) {
    //console.log(error)
    res.status(500).send({
      success: false,
      message: "Something Went Wrong! Please Try Again Later.",
    });
  }
}

//add monthly rent in monthly rent table
//route /api/monthly_rent
async function add_rent(req, res) {
  try {
    console.log(req.body);
    const data = await db("monthly_rent").insert({
      code: req.body.code,
      location: req.body.location,
      gst: req.body.gst,
      utr_no: req.body.utr_no,
      landlord_name: req.body.landlord_name,
      status: req.body.status,
      rent_date: req.body.rent_date,
      rent_amount: req.body.rent_amount,
      landlord_name: req.body.landlord_name,
      share: req.body.share,
      monthly_rent: req.body.monthly_rent,
    });
    console.log(data);
    if (data.length > 0) {
      return res.send({ success: true });
    } else {
      return res.send({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong Please Try Again later.",
    });
  }
}

async function list_month_rent(req, res) {
  try {
    const data = await db("monthly_rent").select("*").where(cb=>{
      cb.orWhere("status","=","Sent To Sr Manager");
      cb.orWhere("status","=","Sent To Operations");
      cb.orWhere("status","=","Sent To Finance");
      cb.orWhere("status","=","Pending");
    });

    //console.log(data)
    if (data) return res.send(data);
    else return res.send([]);
  } catch (err) {
    //console.log(err)
    return res.status(500).send("Something went wrong");
  }
}



async function list_month_rent_paid(req, res) {
  try {
    const data = await db("monthly_rent").select("*").where(cb=>{
      cb.orWhere("status","=","Paid");
    });

    //console.log(data)
    if (data) return res.send(data);
    else return res.send([]);
  } catch (err) {
    //console.log(err)
    return res.status(500).send("Something went wrong");
  }
}

async function add_invoice(req, res) {
  try {
    const invoice = await db("monthly_rent")
      .update({
        invoice_number: req.body.invoiceNo,
        invoice_date: req.body.invoiceDate,
        rent_amount: req.body.rentAmount,
        gst_amount: req.body.gstAmount,
        invoice: req.body.invoice,
        status: "Sent To Sr Manager",
        manager_id: req.body.manager_id,
      })
      .where("id", "=", req.params.id);
    console.log(invoice);
    if (invoice === 1) {
      return res
        .status(201)
        .send({ success: true, message: "Invoice Details Added" });
    } else {
      return res.status(203).send({
        success: false,
        message: "omething Went Wrong Please Try Again Later",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong Please Try Again Later",
    });
  }
}

async function update_payment_status(req, res) {
  try {
    console.log(">>>>>>>>", req.body);
    const invoice = await db("monthly_rent")
      .update(req.body)
      .where("id", "=", req.params.id);
    if (invoice === 1) {
      return res.status(200).send({ success: true, message: "Done" });
    } else {
      return res.status(203).send({
        success: false,
        message: "something Went Wrong Please Try Again Later",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong Please Try Again Later",
    });
  }
}

//view page data get by code
async function get_agreements_code(req, res) {
  try {
    console.log(req.body.id);
    const data = await db("monthly_rent")
      .where("monthly_rent.id", "=", req.params.id)
      .select(
        "landlords.*",
        "agreements.*",
        "agreements.utr_number as utr_deposit",
        "landlords.id as landlord_id",
        "monthly_rent.id as monthly_rent_id",
        "monthly_rent.*",
        "monthly_rent.payment_date as rent_paid_date",
        "monthly_rent.status as payment_status"
      )
      .join("agreements", "monthly_rent.code", "=", "agreements.code")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id");
    //   .where("code","=", req.params.id);

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
          },
        };
      }
    });

    return res.status(200).send({ agreement, ids });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong Please Try Again Later",
    });
  }
}

//invoice Number verification
async function invoice_number_verification(req, res) {
  try {
    const invoice = await db("monthly_rent")
      .select("invoice_number")
      .where("invoice_number", "=", req.params.invoice);
    console.log(invoice);
    if (invoice.length > 0) {
      return res.send({ alreadyInvoice: true });
    } else {
      return res.send({ alreadyInvoice: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong Please Try Again Later",
    });
  }
}

module.exports = {
  add_rent,
  get_landlord_id,
  list_month_rent,
  add_invoice,
  update_payment_status,
  get_agreements_code,
  invoice_number_verification,
  list_month_rent_paid
};
