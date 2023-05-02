const moment = require("moment/moment");
const db = require("../data/db");
const excel = require("exceljs");

async function get_Rental_Property_Dump_Report(req, res) {
  const { startDate, endDate, role, id } = req.query;
  try {
    db.raw(
      `SELECT distinct a.location as property_code,(select name from users where id=a.buh_id) as BUH,(select name from users where id=a.srm_id) as SR_MANAGER,(select name from users where id=a.manager_id) as Manager,a.city,a.state,a.location,l.name as lanlord_name,a.address as property_address,a.deposit as deposite_amount,a.monthlyRent as Monthly_rental,a.rent_start_date as Agreement_Start_Date,(CASE     WHEN a.tenure='11 Month' THEN DATE_SUB(DATE_SUB(a.final_agreement_date,INTERVAL -11 MONTH),INTERVAL 1 DAY) WHEN a.tenure='2 Year' THEN DATE_SUB(DATE_SUB(a.final_agreement_date,INTERVAL -24 MONTH),INTERVAL 1 DAY) WHEN a.tenure='4 Year' THEN DATE_SUB(DATE_SUB(a.final_agreement_date,INTERVAL -48 MONTH),INTERVAL 1 DAY) ELSE null END) as Agreement_End_Date,a.terminate_date as Surrender_Date,a.lockInYear as Lock_in_period,a.noticePeriod as Notice_Period,l.panNo as PAN_Details,l.gstNo as GST_Details,l.bankName,l.accountNo,l.ifscCode,l.benificiaryName,a.code,a.id FROM agreements a, landlords l where a.id=l.agreement_id and a.time >=? and a.time <= ? ORDER by a.code,a.location`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Rental_Property_Dump_Report");
      // excel column list
      worksheet.columns = [
        { header: "Property Code", key: "property_code", width: 15 },
        { header: "BUH", key: "BUH", width: 15 },
        { header: "Senior Manager", key: "SR_MANAGER", width: 15 },
        { header: "Manager", key: "Manager", width: 15 },
        { header: "City", key: "city", width: 15 },
        { header: "State", key: "state", width: 15 },
        { header: "Location", key: "location", width: 15 },
        { header: "Lanlord Name", key: "lanlord_name", width: 15 },
        { header: "Property Address", key: "property_address", width: 15 },
        { header: "Deposite Amount", key: "deposite_amount", width: 15 },
        { header: "Monthly Rental", key: "Monthly_rental", width: 15 },
        {
          header: "Agreement Start Date",
          key: "Agreement_Start_Date",
          width: 15,
        },
        { header: "Agreement End Date", key: "Agreement_End_Date", width: 15 },
        { header: "Surrender Date", key: "Surrender_Date", width: 15 },
        { header: "Lock-in Period", key: "Lock_in_period", width: 15 },
        { header: "Notice Period", key: "Notice_Period", width: 15 },
        { header: "Pan Details", key: "PAN_Details", width: 15 },
        { header: "GST Details", key: "GST_Details", width: 15 },
        { header: "Bank Name", key: "bankName", width: 15 },
        { header: "A/c No.", key: "accountNo", width: 15 },
        { header: "IFSC Code", key: "ifscCode", width: 15 },
        { header: "Benificiary Name", key: "benificiaryName", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Rental_Property_Dump_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Rental_Payment_MIS(req, res) {
  const { startDate, endDate } = req.query;

  try {
    db.raw(
      `SELECT distinct a.location as property_code,(select name from users where id=a.buh_id) as BUH,(select name from users where id=a.srm_id) as SR_MANAGER,(select name from users where id=a.manager_id) as Manager,a.city,a.state,l.name as Lanlord_Name,a.address as property_address,concat(monthname(a.time),'-', year(a.time)) AS Month,'' as Stage,m.status as Rental_Status,0 as Ageing,m.payment_date,m.utr_no FROM agreements a, landlords l, monthly_rent m where a.id=l.agreement_id and a.code=m.code and a.time >=? and a.time <=?`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Rental_Property_Dump_Report");
      // excel column list
      worksheet.columns = [
        { header: "property_code", key: "property_code", width: 15 },
        { header: "BUH", key: "BUH", width: 15 },
        { header: "Senior Manager", key: "SR_MANAGER", width: 15 },
        { header: "Manager", key: "Manager", width: 15 },
        { header: "City", key: "city", width: 15 },
        { header: "State", key: "state", width: 15 },
        { header: "Lanlord Name", key: "Lanlord_Name", width: 15 },
        { header: "Property Address", key: "property_address", width: 15 },
        { header: "Month", key: "Month", width: 15 },
        { header: "Stage", key: "Stage", width: 15 },
        { header: "Rental Status", key: "Rental_Status", width: 15 },
        { header: "Ageing", key: "Ageing", width: 15 },
        { header: "Payment Date", key: "payment_date", width: 15 },
        { header: "UTR No", key: "utr_no", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Rental_Property_Dump_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Rental_Onboarding_All_Status(req, res) {
  const { startDate, endDate } = req.query;

  try {
    db.raw(
      `SELECT distinct a.location as property_code,(select name from users where id=a.buh_id) as BUH,(select name from users where id=a.srm_id) as SR_MANAGER,(select name from users where id=a.manager_id) as Manager,a.city,a.state,l.name as Lanlord_name,a.address as Property_address,concat(monthname(a.time),'-', year(a.time)) AS Month,a.status,a.code,a.id FROM agreements a, landlords l where a.id=l.agreement_id and a.time >= ? and a.time <=? `,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Rental_Property_Dump_Report");
      // excel column list
      worksheet.columns = [
        { header: "Property Code", key: "property_code", width: 15 },
        { header: "BUH", key: "BUH", width: 15 },
        { header: "Senior Manager", key: "SR_MANAGER", width: 15 },
        { header: "Manager", key: "Manager", width: 15 },
        { header: "City", key: "city", width: 15 },
        { header: "State", key: "state", width: 15 },
        { header: "Lanlord Name", key: "Lanlord_name", width: 15 },
        { header: "Property Address", key: "Property_address", width: 15 },
        { header: "Month", key: "Month", width: 15 },
        { header: "Status", key: "status", width: 15 },
      ];

      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Rental_Property_Dump_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Rental_Onboarding_Deposited(req, res) {
  const { startDate, endDate } = req.query;

  try {
    db.raw(
      `SELECT distinct a.location as property_code,(select name from users where id=a.buh_id) as BUH,(select name from users where id=a.srm_id) as SR_MANAGER,(select name from users where id=a.manager_id) as Manager,a.city,a.state,l.name as Lanlord_name,a.address as Property_address,concat(monthname(a.time),'-', year(a.time)) AS Month,a.status,a.code,a.id FROM agreements a, landlords l where a.id=l.agreement_id and a.status='Deposited' and a.time >=? and a.time <= ?`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Rental_Property_Dump_Report");
      // excel column list
      worksheet.columns = [
        { header: "Property Code", key: "property_code", width: 15 },
        { header: "BUH", key: "BUH", width: 15 },
        { header: "Senior Manager", key: "SR_MANAGER", width: 15 },
        { header: "Manager", key: "Manager", width: 15 },
        { header: "City", key: "city", width: 15 },
        { header: "State", key: "state", width: 15 },
        { header: "Lanlord Name", key: "Lanlord_name", width: 15 },
        { header: "Property Address", key: "Property_address", width: 15 },
        { header: "Month", key: "Month", width: 15 },
        { header: "Status", key: "status", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Rental_Property_Dump_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Rent_Paid_Schedule(req, res) {
  const { startDate, endDate, role, id } = req.query;

  const year = moment(startDate).format("YYYY");

  try {
    db.raw(
      `SELECT 
      distinct a.code, 
      a.id, 
      l.name as Landlord_name, 
      a.location as Property_name, 
      a.deposit as Deposit_amount, 
      a.city, 
      a.state, 
      a.payment_date,  
      MAX(CASE WHEN MONTH(a.payment_date) = 4 THEN m.monthly_rent ELSE NULL END) AS Apr,
      MAX(CASE WHEN MONTH(a.payment_date) = 5 THEN m.monthly_rent ELSE NULL END) AS May,
      MAX(CASE WHEN MONTH(a.payment_date) = 6 THEN m.monthly_rent ELSE NULL END) AS Jun,
      MAX(CASE WHEN MONTH(a.payment_date) = 7 THEN m.monthly_rent ELSE NULL END) AS Jul,
      MAX(CASE WHEN MONTH(a.payment_date) = 8 THEN m.monthly_rent ELSE NULL END) AS Aug,
      MAX(CASE WHEN MONTH(a.payment_date) = 9 THEN m.monthly_rent ELSE NULL END) AS Sep,
      MAX(CASE WHEN MONTH(a.payment_date) = 10 THEN m.monthly_rent ELSE NULL END) AS Oct,
      MAX(CASE WHEN MONTH(a.payment_date) = 11 THEN m.monthly_rent ELSE NULL END) AS Nov,
      MAX(CASE WHEN MONTH(a.payment_date) = 12 THEN m.monthly_rent ELSE NULL END) AS Dece,
       MAX(CASE WHEN MONTH(a.payment_date) = 1 THEN m.monthly_rent ELSE NULL END) AS Jan,
       MAX(CASE WHEN MONTH(a.payment_date) = 2 THEN m.monthly_rent ELSE NULL END) AS Feb,
        MAX(CASE WHEN MONTH(a.payment_date) = 3 THEN m.monthly_rent ELSE NULL END) AS Mar,
      a.final_agreement_date as Agreement_Start_Date, 
      (
        CASE WHEN a.tenure = '11 Month' THEN DATE_SUB(
          DATE_SUB(
            a.final_agreement_date, INTERVAL -11 MONTH
          ), 
          INTERVAL 1 DAY
        ) WHEN a.tenure = '2 Year' THEN DATE_SUB(
          DATE_SUB(
            a.final_agreement_date, INTERVAL -24 MONTH
          ), 
          INTERVAL 1 DAY
        ) WHEN a.tenure = '4 Year' THEN DATE_SUB(
          DATE_SUB(
            a.final_agreement_date, INTERVAL -48 MONTH
          ), 
          INTERVAL 1 DAY
        ) ELSE null END
      ) as Agreement_End_Date, 
      a.terminate_date as Surrender_date 
    FROM 
      agreements a, 
      landlords l, 
      monthly_rent m 
    where 
      a.id = l.agreement_id 
      and a.code = m.code 
      and a.payment_date is NOT null 
      and a.payment_date != '' 
      and a.time >= ? 
      and a.time <= ? 
    GROUP by 
      a.code, 
      a.id, 
      l.name, 
      a.location, 
      a.deposit, 
      a.payment_date, 
      a.city, 
      a.state, 
      a.tenure, 
      a.final_agreement_date, 
      a.final_agreement_date, 
      a.terminate_date`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Rent_Paid_Schedule");
      // excel column list
      worksheet.columns = [
        { header: "Property Code", key: "property_code", width: 15 },
        { header: "Landlord Name", key: "Landlord_name", width: 15 },
        { header: "Property Name", key: "Property_name", width: 15 },
        { header: "Deposit Amount", key: "Deposit_amount", width: 15 },
        { header: "City", key: "city", width: 15 },
        { header: "State", key: "state", width: 15 },
        { header: "Payment Date", key: "payment_date", width: 15 },
        {
          header: `Apr ${moment(year).add(3, "M").format("YYYY")}`,
          key: "Apr",
          width: 15,
        },
        {
          header: `May ${moment(year).add(4, "M").format("YYYY")}`,
          key: "May",
          width: 15,
        },
        {
          header: `Jun ${moment(year).add(5, "M").format("YYYY")}`,
          key: "Jun",
          width: 15,
        },
        {
          header: `Jul ${moment(year).add(6, "M").format("YYYY")}`,
          key: "Jul",
          width: 15,
        },
        {
          header: `Aug  ${moment(year).add(7, "M").format("YYYY")}`,
          key: "Aug",
          width: 15,
        },
        {
          header: `Sep ${moment(year).add(8, "M").format("YYYY")}`,
          key: "Sep",
          width: 15,
        },
        {
          header: `Oct ${moment(year).add(9, "M").format("YYYY")}`,
          key: "Oct",
          width: 15,
        },
        {
          header: `Nov ${moment(year).add(10, "M").format("YYYY")}`,
          key: "Nov",
          width: 15,
        },
        {
          header: `Dec ${moment(year).add(11, "M").format("YYYY")}`,
          key: "Dece",
          width: 15,
        },
        {
          header: `Jan ${moment(year).add(12, "M").format("YYYY")}`,
          key: "Jan",
          width: 15,
        },
        {
          header: `Feb ${moment(year).add(13, "M").format("YYYY")}`,
          key: "Feb",
          width: 15,
        },
        {
          header: `Mar ${moment(year).add(14, "M").format("YYYY")}`,
          key: "Mar",
          width: 15,
        },
        {
          header: "Agreement Start Date",
          key: "Agreement_Start_Date",
          width: 15,
        },
        { header: "Agreement End Date", key: "Agreement_End_Date", width: 15 },
        { header: "Surrender Date", key: "Surrender_date", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Rent_Paid_Schedule.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      // res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_No_Of_Agreements(req, res) {
  const { startDate, endDate, role, id } = req.query;
  try {
    db.raw(
      `SELECT DATE_FORMAT(a.payment_date, '%M-%y') AS month, count(a.monthlyRent) AS no_of_agreement FROM agreements a where  a.payment_date is NOT null and a.payment_date != '' and a.time >= ? and a.time <= ? GROUP BY DATE_FORMAT(a.payment_date, '%M-%y')`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("No_Of_Agreements_Report");
      // excel column list
      worksheet.columns = [
        { header: "Month", key: "month", width: 15 },
        { header: "No of agreements", key: "no_of_agreement", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "No_Of_Agreements_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Monthly_Rent(req, res) {
  const { startDate, endDate, role, id } = req.query;
  try {
    db.raw(
      `SELECT DATE_FORMAT(a.payment_date, '%M-%y') AS month, SUM(a.monthlyRent) AS total_rent FROM agreements a, landlords l, monthly_rent m where a.id = l.agreement_id and a.code = m.code and a.payment_date is NOT null and a.payment_date != '' and a.time >= ? and a.time <= ? and a.status='Deposited' GROUP BY DATE_FORMAT(a.payment_date, '%M-%y');`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Monthly_Rent_Report");
      // excel column list
      worksheet.columns = [
        { header: "Month", key: "month", width: 15 },
        { header: "Total rent", key: "total_rent", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Monthly_Rent_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

async function get_Monthly_Deposit(req, res) {
  const { startDate, endDate, role, id } = req.query;
  try {
    db.raw(
      `SELECT DATE_FORMAT(a.payment_date, '%M-%y') AS month, SUM(a.deposit) AS total_deposit FROM agreements a, landlords l, monthly_rent m where a.id = l.agreement_id and a.code = m.code and a.payment_date is NOT null and a.payment_date != '' and a.time >= ? and a.time <= ? and a.status='Deposited' GROUP BY DATE_FORMAT(a.payment_date, '%M-%y');`,
      [startDate, endDate]
    ).then(function (resp) {
      let report = resp[0];

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Monthly_Deposit_Report");
      // excel column list
      worksheet.columns = [
        { header: "Month", key: "month", width: 15 },
        { header: "Total deposit", key: "total_deposit", width: 15 },
      ];
      worksheet.addRows(report);
      // response to send to frontend
      // res is a Stream object
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Monthly_Deposit_Report.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

      //   res.send(resp[0]);
    });
  } catch (error) {}
}

module.exports = {
  get_Rental_Property_Dump_Report,
  get_Rental_Payment_MIS,
  get_Rental_Onboarding_All_Status,
  get_Rental_Onboarding_Deposited,
  get_Rent_Paid_Schedule,
  get_No_Of_Agreements,
  get_Monthly_Rent,
  get_Monthly_Deposit,
};