const express = require("express");
const { get_Rental_Property_Dump_Report,
    get_Rental_Payment_MIS,
    get_Rental_Onboarding_All_Status,
    get_Rental_Onboarding_Deposited,
    get_Rent_Paid_Schedule,
    get_No_Of_Agreements,
    get_Monthly_Rent,
    get_Monthly_Deposit, } = require("../controller/MisReportControls");

const router = express.Router();

router
  .route("/get-rental-property-dump-report")
  .get(get_Rental_Property_Dump_Report);

router.route("/rental-payment-mis").get(get_Rental_Payment_MIS);

router
  .route("/rental-onboarding-all-status")
  .get(get_Rental_Onboarding_All_Status);

router
  .route("/rental-onboarding-deposited")
  .get(get_Rental_Onboarding_Deposited);

router.route("/rent-paid-schedule").get(get_Rent_Paid_Schedule);

router.route("/no-of-agreements").get(get_No_Of_Agreements);

router.route("/monthly-rent").get(get_Monthly_Rent);

router.route("/monthly-deposit").get(get_Monthly_Deposit);

module.exports = router;