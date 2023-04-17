// env config 
require('dotenv').config()
// db connection 
const db = require("../data/db");
const moment = require('moment')

const CronJob = require('cron').CronJob
const mailer = require('nodemailer')
// const intervalTime = '15 10 15 * *' // interval time for monthly rent payment date 
// const intervalTime = '* * * * * *' // interval time for monthly rent payment date 
const intervalTime = '*/5 * * * *' // interval time for monthly rent payment date 


// building a job constructor for sending a notification mail at 15th of every month
const job = new CronJob(intervalTime,CallBack,null,true,'America/Los_Angeles');

// creating a transport for sending mails on desired emails 
  let transporter = mailer.createTransport({
    service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
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

async function CallBack (){
    try {

        get_monthly_rent( )
        // let response = await transporter.sendMail(info)

        // if(response)
        // {
        //     console.log(response)
        // }
        
    } catch (error) {
        console.log("Cron Jobs Error >>>",error)
    }   
}


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
      //console.log(error);
      return res.status(500).send();
    }
  }



  
  module.exports =  {job}

