require("dotenv").config();
const { select } = require("../data/db");
const db = require("../data/db");

const newAgreement = async (req, res) => {

  try {

    const agreement = await db("agreements").insert(req.body);


    if (agreement.length == 1) {
      res.status(201).send({ success: true, message: "Agreement Submit Successfully", agreement })
    }
    else {
      throw new Error({ success: false, message: "Something went wrong Please" })
    }
  } catch (error) {
    console.log(error)
    res.send({ success: false, message: "Something went wrong Please", error });
  }
};


async function add_landlord(req, res) {
  // console.log(req.body)
  try {
    const lanloard = await db("landlords").insert(req.body)

    if (lanloard) {
      res.send({ message: 'Landlord Added.' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Something went wrong !!!' })

  }

}

const getAllAgreement = async (req, res) => {
  try {
    const data = await db('agreements')
      .select('landlords.name', 'landlords.agreement_id', 'landlords.location', 'landlords.id', 'agreements.*')
      .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')


    let ids = [];
    let agreement = {}
    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = { ...agreement, [row.id]: { ...agreement[row.id], name: [...agreement[row.id].name, row.name] } }
      } else {
        ids.push(row.id)
        agreement = { ...agreement, [row.id]: { ...row, name: [row.name] } }

      }
    })
    console.log(agreement)

    // console.log(data)

    res.send({ success: true, agreement, ids })
  } catch (error) {
    console.log(error)
    res.send({ success: false, message: "something Went Wrong please try again later" })
  }
}


const get_tenure = async (req, res) => {
  try {
    var m11 = new Date(Date.now());

    m11.setMonth(m11.getMonth() - 10);

    console.log('11m>>>', m11);

    var y3 = new Date(Date.now());
    y3.setMonth(y3.getMonth() - (10 * 3));
    console.log('y3>>>', y3);

    var y5 = new Date(Date.now());
    y5.setMonth(y5.getMonth() - (10 * 5));
    console.log('y5>>>', y5);

    var tenure11Month = await db.from('agreements').select('*')
      .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')
      .orderBy('agreements.time', "desc")
    tenure11Month = tenure11Month.map((row, i) => {

      switch (row.tenure) {
        case "11 Month": var m11 = new Date(row.time);
          m11.setMonth(m11.getMonth() - 10);
          return row.time >= m11 && row

        case "3 Year": var y3 = new Date(Date.now());
          y3.setMonth(y3.getMonth() - (10 * 3));
          return row.time >= y3 && row

        case "5 Year":
          var y5 = new Date(Date.now());
          y5.setMonth(y5.getMonth() - (10 * 5));
          return row.time >= y5 && row

        default: return row
      }


    })
    console.log(tenure11Month)
    return res.send({ success: true, renewal: tenure11Month })
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
}

async function getAgreementById(req, res) {
  try {
    const agreement = await db('landlords')
      .join('agreements', 'agreements.id', '=', 'landlords.agreement_id')
      .select('*')


    agreement.map((row, i) => {
      console.log(row.id, req.params.id)
      if (row.agreement_id == req.params.id) {
        return res.send(row)
      }
    })

    return res.send(agreement)

  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
}



// const UpdateStatus = async(req,res)=>{
//   try {
//     const update = await db('agreements').where('id',req.params.id).update(req.body)
//     if(update === 1){
//       res.send({success:true,message:"Agreement Update Successfully"})
//     }else{
//       throw new Error({success:false,message:"Something went wrong please try again later"})
//     }
//   } catch (error) {
//     res.send({success:false,message:"Something went wrong please try again later"})
//   }
// }  

const updateAgreement = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.params.id)
    const update = await db('agreements').where('id','=', req.params.id).update({status:req.body.status,srm_id:req.body.srm_id})
    if (update === 1) {
      res.send({ success: true, message: "Agreement Update Successfully" })
    } else {
      console.log(update)
      // throw new Error({ success: false, message: "Something went wrong please try again later" })
    }
  } catch (error) {
    console.log(error)
    res.send({ success: false, message: "Something went wrong please try again later" })
  }
}

const deleteAgreement = async (req, res) => {
  try {
    console.log(req.params.id)
    const result = await db('agreements').where('id', req.params.id).del();
    const landlords = await db('landlords').where('agreement_id', req.params.id).del();
    console.log(result, landlords)
    if (result === 1 && landlords === 1) {
      res.status(202).send({ success: true, message: "Delete Successful" })
    } else {
      res.send({ success: false, message: "Something went Wrong Please try again later" })
    }
  } catch (error) {
    console.log(error)
    res.send({ success: false, message: "Something went Wrong Please try again later" })
  }
}

const uploadDoc = async (req, res) => {
  try {
    if (req.files['photo']) {
      res.send({ link: `${process.env.IMAGE_LINK_O + req.files['photo'][0].path}`, message: 'Document Uploaded' })
    }
    else {
      res.status(203).send({ message: 'Pleae Provide the document.' })
    }
  } catch (error) {
    console.log(error)
    res.send({ message: "Something went Wrong !!!" })
  }
}


async function get_monthly_rent(req, res) {
  try {

    var tenure11Month = await db.from('agreements').select('*')
      .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')
      .orderBy('agreements.time', "desc")
    console.log(tenure11Month)
    tenure11Month = tenure11Month.map((row, i) => {

      var m11 = new Date(row.time);
      m11.setMonth(m11.getMonth() - 1);
      return row.time >= m11 && row


    })

    return res.send({ success: true, monthly_rent: tenure11Month })
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
}


async function getStateList(req, res) {
  try {

    if (req.query.search) {
      let { search } = req.query
      let stateList = await db.table('state').select('name', 'id').whereILike('name', `%${search}%`).limit(10);
      // let stateList = await db.table('state').select('name','id').whereILike('name',`%${search}%`).limit(10);

      if (stateList) {
        return res.send(stateList)
      }
    }
    else return res.send([])


  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }

}

async function getCityList(req, res) {
  try {

    if (req.query.search) {
      let { search } = req.query
      let cityList = await db.table('city').select('city', 'state_id').where('state_id', `${search}`)

      if (cityList) {
        return res.send(cityList)
      }
    }
    else return res.send([])


  } catch (error) {
    console.log(error)
    res.status(500).send('Error')
  }

}

async function detailsAgreement(req, res) {
  try {
    console.log(req.query.id)
    const agreement = await db('agreements').where('')
      .join('landlords', 'agreements.id', '=', 'landlords.agreement_id')


    agreement.map((row, i) => {
      console.log(row.id, req.params.id)
      if (row.agreement_id == req.params.id) {
        return res.send(row)
      }
    })

    return res.send(agreement)

  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }
}

async function getAgreementById(req, res) {
  try {

    const data = await db("agreements")
      .select(
        "landlords.*",
        "agreements.*",
        "landlords.id as landlord_id"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where('agreement_id', req.query.id)

    console.log(data)

    let ids = [];
    let agreement = {};
    data.map((row) => {
      if (ids.includes(row.id)) {
        agreement = {
          ...agreement, landlord: [...agreement.landlord, {
            landlord_id: row.landlord_id,
            name: row.name,
            percentageShare: row.percentageShare,
            leeseName: row.leeseName,
            state: row.state,
            city: row.city,
            location: row.location,
            pincode: row.pincode,
            address: row.address,
            aadharNo: row.aadharNo,
            panNo: row.panNo,
            gstNo: row.gstNo,
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
          }],

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
              state: row.state,
              city: row.city,
              location: row.location,
              pincode: row.pincode,
              address: row.address,
              aadharNo: row.aadharNo,
              panNo: row.panNo,
              gstNo: row.gstNo,
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
            }]
        }
      }
    });
    console.log(agreement)

    return res.status(200).send(agreement);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
}

async function editAgreement(req, res) {
  try {
    // console.log(req.body)

    let { id,
      code
      , lockInYear
      , monthlyRent
      , noticePeriod
      , yearlyIncrement
      , deposite
      , gst_certificate
      , draft_agreement
      , electricity_bill
      , poa
      , maintaince_bill
      , cheque
      , tax_receipt
      , noc
      , tenure
      , year1
      , year2
      , year3
      , year4
      , year5, landlord
    } = req.body


    let saveAgreement = await db('agreements').where('id', '=', id).update({
      code
      , lockInYear
      , monthlyRent
      , noticePeriod
      , yearlyIncrement
      , deposite
      , gst_certificate
      , draft_agreement
      , electricity_bill
      , poa
      , maintaince_bill
      , cheque
      , tax_receipt
      , noc
      , tenure
      , year1
      , year2
      , year3
      , year4
      , year5
    })

    console.log(saveAgreement)

    if (saveAgreement) {
      console.log(landlord)
      Promise.all(landlord.map(async (row, index) => {
        
        let {
          name,
          percentageShare,
          leeseName,
          state,
          city,
          location,
          pincode,
          address,
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
          aadhar_card,
          pan_card
        } = row
        return await await db('landlords').where('id', '=', row.landlord_id).update({name, percentageShare,
          state,
          city,
          location,
          pincode,
          address,
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
          aadhar_card,
          pan_card })
      }))
        .then(() => {
          return res.send({ message: 'Agreement edited' })
        })
        .catch((err) => {
          console.log('err=>', err)
          res.status(501).send({ message: 'Landloard not updated' })
        })

    }
    else {
      res.status(501).send({ message: 'Landloard not updated' })
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Agreement edited' })

  }

}

//search use by field name
async function user_search_manager (req,res){
  try {
      const data = await db('agreements').select("*")
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .whereILike('name',`%${req.body.name}%`)
   
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
  
      // console.log(data)
  
      res.send({ success: true, agreement, ids });

  } catch (error) {
      console.log(error)
    return  res.status(500).send()
      
  }
  
}


async function get_agreement_details(req, res) {
  try {
  

    const data = await db("agreements")
      .select(
        "landlords.*",
        "agreements.*",
        "landlords.id as landlord_id"
      )
      .join("landlords", "agreements.id", "=", "landlords.agreement_id")
      .where('agreement_id',req.params.id)


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
            percentageShare: [
              ...agreement[row.id].percentageShare,
              row.percentageShare,
            ],
            leeseName: [...agreement[row.id].leeseName, row.leeseName],
            state: [...agreement[row.id].state, row.state],
            city: [...agreement[row.id].city, row.city],
            location: [...agreement[row.id].location, row.location],
            pincode: [...agreement[row.id].pincode, row.pincode],
            address: [...agreement[row.id].address, row.address],
            aadharNo: [...agreement[row.id].aadharNo, row.aadharNo],
            panNo: [...agreement[row.id].panNo, row.panNo],
            gstNo: [...agreement[row.id].gstNo, row.gstNo],
            mobileNo: [...agreement[row.id].mobileNo, row.mobileNo],
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
            percentageShare: [row.percentageShare],
            leeseName: [row.leeseName],
            state: [row.state],
            city: [row.city],
            location: [row.location],
            pincode: [row.pincode],
            address: [row.address],
            aadharNo: [row.aadharNo],
            panNo: [row.panNo],
            gstNo: [row.gstNo],
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
    return res.status(500).send();
  }
}


module.exports = {get_agreement_details,user_search_manager, editAgreement, detailsAgreement, getCityList, getStateList, get_monthly_rent, get_tenure, newAgreement, getAllAgreement, getAgreementById, updateAgreement, deleteAgreement, add_landlord, uploadDoc }  