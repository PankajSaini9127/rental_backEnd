const express = require("express");
const {
  getAllAgreement,
  updateAgreement,
  finance_get_monthly_rent,
  insertRecoveryLog,
  getRecoveryLog,
  finance_agreement_search,
  get_dashboard_dats_finance,
  get_agreements_by_id,
  addutr,
  get_all_agreements_inProcess,
  get_all_agreements_approved,
} = require("../controller/FinanceControls");

const router = express.Router();

//get all agreements for listing
router.route("/get-agreement/:id").get(getAllAgreement);

router.route("/in-process/get-agreement/:id").get(get_all_agreements_inProcess);

router.route("/approved/get-agreement/:id").get(get_all_agreements_approved);


router.route("/search/:id").get(finance_agreement_search);

router.route("/updateAgreement/finance/:id").put(updateAgreement);

router.route("/add-utr/finance/:id").put(addutr);

router.route("/finance-monthly-rent/:id").get(finance_get_monthly_rent);

router.route("/insertRecoveryLog").post(insertRecoveryLog);

router.route("/getRecoveryLog").get(getRecoveryLog);

router.route("/dashboard/get-meta/:id").get(get_dashboard_dats_finance);

router.route("/agreement/:id").get(get_agreements_by_id)

module.exports = router;
