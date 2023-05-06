const express = require('express');
const {  getAllAgreement, get_monthly_rent_opr, get_monthly_search_opr, agreement_search_opr, get_dashboard_dats_opr, get_monthly_rent_opr_paid, getAll_Approved_agreements, getAll_total_agreements, agreement_search_opr_process, agreement_search_opr_approved } = require('../controller/OperationsControls');


const router = express.Router();


//get all agreements for listing
// path /api/getagreement/:id
router.route('/get-agreement/:id').get(getAllAgreement)


//get approved agreements
router.route("/approved/get-agreement/:id").get(getAll_Approved_agreements)

//get total agreements
router.route("/total/get-agreement/:id").get(getAll_total_agreements)

//total ag serach
router.route('/search/:id').get(agreement_search_opr)

//in process agreements search
router.route('/search/in-process/:id').get(agreement_search_opr_process)

//approved agreements search
router.route('/search/approved/:id').get(agreement_search_opr_approved)

router.route('/opr-monthly-payment/:id').get(get_monthly_rent_opr)

router.route('/paid/opr-monthly-payment/:id').get(get_monthly_rent_opr_paid)

router.route('/get-search-operations-monthlyrent').get(get_monthly_search_opr)

router.route("/dashboard/get-meta/:id").get(get_dashboard_dats_opr)


module.exports = router