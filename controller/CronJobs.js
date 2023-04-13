// env config 
require('dotenv').config()

const CronJob = require('cron').CronJob
const mailer = require('nodemailer')
// const intervalTime = '15 10 15 * *' // interval time for monthly rent payment date 
const intervalTime = '* * * * * *' // interval time for monthly rent payment date 


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

        let response = await transporter.sendMail(info)

        if(response)
        {
            console.log(response)
        }
        
    } catch (error) {
        console.log("Cron Jobs Error >>>",error)
    }   
}

job.start()
