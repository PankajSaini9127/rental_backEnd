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
  finance_get_monthly_rent_paid,
  get_monthly_search,
  get_monthly_search_paid,
  convert_to_paid,
  get_old_agreement_finance
} = require("../controller/FinanceControls");

const router = express.Router();

//get old agreements value finance
router.route('/old/agreements').get(get_old_agreement_finance)

//get all agreements for listing
router.route("/get-agreement/:id").get(getAllAgreement);

router.route("/in-process/get-agreement/:id").get(get_all_agreements_inProcess);

router.route("/approved/get-agreement/:id").get(get_all_agreements_approved);


router.route("/search/:id").get(finance_agreement_search);

router.route("/updateAgreement/finance/:id").put(updateAgreement);

router.route("/add-utr/finance/:id").put(addutr);

router.route("/finance-monthly-rent/:id").get(finance_get_monthly_rent);

router.route("/paid/finance-monthly-rent/:id").get(finance_get_monthly_rent_paid);

router.route("/get-search-finance-monthlyrent").get(get_monthly_search);

router.route("/paid/get-search-finance-monthlyrent").get(get_monthly_search_paid);


router.route("/insertRecoveryLog").post(insertRecoveryLog);

router.route("/getRecoveryLog").get(getRecoveryLog);

router.route("/dashboard/get-meta/:id").get(get_dashboard_dats_finance);

router.route("/agreement/:id").get(get_agreements_by_id);

router.route("/convert-to-paid").put(convert_to_paid);

module.exports = router;
