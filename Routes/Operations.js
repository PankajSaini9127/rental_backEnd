const express = require('express');
const {  getAllAgreement, get_monthly_rent_opr, get_monthly_search_opr, agreement_search_opr, get_dashboard_dats_opr } = require('../controller/OperationsControls');


const router = express.Router();


//get all agreements for listing
// path /api/getagreement/:id
router.route('/get-agreement/:id').get(getAllAgreement)


router.route('/search/:id').get(agreement_search_opr)

router.route('/opr-monthly-payment/:id').get(get_monthly_rent_opr)

router.route('/get-search-operations-monthlyrent').get(get_monthly_search_opr)

router.route("/dashboard/get-meta/:id").get(get_dashboard_dats_opr)


module.exports = router