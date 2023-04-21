// env config 
require('dotenv').config()
// db connection 
const db = require("../data/db");
const moment = require('moment')

const CronJob = require('cron').CronJob
const mailer = require('nodemailer')
// const intervalTime = '15 10 15 * *' // interval time for monthly rent payment date 
// const intervalTime = '* * * * * *' // interval time for monthly rent payment date 
const intervalTimeMonthlyRenewal = '*/1 * * * *' // interval time for monthly rent payment date 


// building a job constructor for sending a notification mail at 15th of every month
const job = new CronJob(intervalTimeMonthlyRenewal, get_monthly_rent, null, true, 'America/Los_Angeles');
const job2 = new CronJob(intervalTimeMonthlyRenewal, get_renewal, null, true, 'America/Los_Angeles');

// creating a transport for sending mails on desired emails 
let transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// send mail with defined transport object
let info = {
  from: '"Andromeda" andromeda@gmail.com ', // sender address
  to: "yashwantsahu3002@gmail.com", // list of receivers
  subject: "Hey don't panic. This is just a test mail for you.", // Subject line
  text: "Hi, how are you buddy.", // plain text body
  // html: "<b>Hello world?</b>", // html body
};


async function get_monthly_rent(req,res) {
    try {
      var listAgreement = await db
        .from("agreements")
        .select("*")
        .join("landlords", "agreements.id", "=", "landlords.agreement_id")
        .whereNotNull("rent_start_date").andWhere("status","Pending")
        // console.log("list >>>>>>>>>>> ",listAgreement)
        // itrating and creating a slab from here
        Promise.allSettled(listAgreement.map(async(row, i) => {        
        // calculating the final amount
        const finalAmountForFullMonth = (row.monthlyRent/100)*parseInt(row.percentage) 
  
        // this code will also add the field for next month 
  
        const todayMoment = moment()

        // for checking the log is already exist in the table or not
        let response = await  db('monthly_rent').select("rent_date").where("code",row.code)


       const tomorrowMoment = todayMoment.clone().add(1,'month')

        response = response.filter((row)=>new Date(row.rent_date).getMonth() === new Date(tomorrowMoment).getMonth() && new Date(row.rent_date).getFullYear() === new Date(tomorrowMoment).getFullYear() )

        console.log('response ===>',response)
        
        if(response.length === 0)
        {
                  return await db('monthly_rent').insert({
                    monthly_rent : row.monthlyRent,
                    code : row.code,
                    location  : row.location ,
                    gst  : row.gstNo || "" ,
                    utr_no  : row.utr_number ,
                    landlord_name: row.name,
                    status: 'Hold',
                    share: row.percentage,
                    rent_amount: finalAmountForFullMonth,
                    rent_date : new Date(tomorrowMoment)
                })
        }
      })).then((response)=>{
          console.log(response)
      }).catch((error)=>{
        console.log(error)
      })
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }
    
// for checking the renewal tenure 
async function get_renewal() {
  try {
    var listAgreement = await db
      .from("agreements")
      .select("final_agreement_date", "tenure", "status","code")
      .where('status', "=", 'Deposited')
      .andWhere('renewal_status',"=",'""')
      
      console.log('>>>>',listAgreement)

    // iterating and creating a slab from here
    console.log(listAgreement)
    Promise.allSettled(listAgreement.map(async (row, i) => {

      // present date
      // let todayMoment = moment()
      let todayMoment = moment().set({ 'year': 2028, 'month': 5 });
      // date when agreement started
      const agreements_start_date = moment(row.final_agreement_date)
      // tenure range
      const tenure = row.tenure
      // check date 
      let expiredAt = ""
      // for select the tenure type
      switch (tenure) {
        case "11 Month":
          expiredAt = agreements_start_date.clone().add(10, 'month')
          console.log("for 11 month :====>", expiredAt)
        case "2 Year":
          expiredAt = agreements_start_date.clone().add(22, 'month')
          console.log("for 2 Years :====>", expiredAt)
          break;
        case "3 Year":
          expiredAt = agreements_start_date.clone().add(34, 'month')
          console.log("for 3 Years :====>", expiredAt)
          break;
        case "4 Year":
          expiredAt = agreements_start_date.clone().add(46, 'month')
          console.log("for 4 Years :====>", expiredAt)
          break;
        case "5 Year":
          expiredAt = agreements_start_date.clone().add(58, 'month')
          console.log("for 5 Years :====>", expiredAt)
          break;
        default:
          console.log("No Tenure Found")
          return false
      }


      expiredAt = new Date(expiredAt)
      todayMoment = new Date(todayMoment)


       console.log("today=>",todayMoment,"agreement =>",expiredAt)
      // checking 60 days bond
      if (expiredAt.getMonth() <= todayMoment.getMonth() && expiredAt.getFullYear() <= todayMoment.getFullYear()) {
        // console.log("month==>", expiredAt.getMonth(), todayMoment.getMonth(), "year =>", expiredAt.getFullYear(), todayMoment.getFullYear())
        return await db("agreements").update({ renewal_status: "Pending For Renewal" }).where("code",row.code)
      }
      else {
        // console.log("month==>", expiredAt.getMonth(), todayMoment.getMonth(), "year =>", expiredAt.getFullYear(), todayMoment.getFullYear())
        return await db("agreements").update({ renewal_status: '""' }).where("code",row.code)
      }

    })).then((response) => {
      console.log(">>>get renewal>",response)
    }).catch((error) => {
      console.log(error)
    })
  } catch (error) {
    console.log(error);

  }
}



module.exports = { job,job2}