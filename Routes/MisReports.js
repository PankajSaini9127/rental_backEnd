const express = require("express");
const {
  get_Rental_Property_Dump_Report,
  get_Rental_Payment_MIS,
  get_Rental_Onboarding_All_Status,
  get_Rental_Onboarding_Deposited,
  get_Rent_Paid_Schedule,
} = require("../controller/MisReportControls");

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

module.exports = router;
