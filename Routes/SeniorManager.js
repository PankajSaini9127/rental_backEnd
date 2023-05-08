const express = require('express');
const { user_search_srmanager, getAllAgreement, srm_get_monthly_rent, srm_get_monthly_rent_id, get_renewal_srm, get_search_renewal_srm, get_search_monthlyrent_srm, get_dashboard_data, getAllApprovedAgreements, srm_get_monthly_rent_paid, get_total_agreements, get_search_monthlyrent_srm_paid } = require('../controller/SRMControllers');


const router = express.Router();


//get all agreements for listing
// path /api/srmanger/getagreement/:id
router.route('/srmanager/get-agreement/:id').get(getAllAgreement)

//approved agreements
router.route('/srmanager/approved/get-agreement/:id').get(getAllApprovedAgreements)

//total agreements
router.route('/srmanager/total/get-agreement/:id').get(get_total_agreements)

router.route('/srmanager-search/:id').post(user_search_srmanager)

router.route('/srmanager/get-monthly-rent/:id').get(srm_get_monthly_rent)

router.route('/srmanager/paid/get-monthly-rent/:id').get(srm_get_monthly_rent_paid)

router.route('/srmanager/get-monthly-rent-id/:id').get(srm_get_monthly_rent_id)

//get renewal list in srm
router.route("/srmanager/get-renewal-srm/:id").get(get_renewal_srm)

//get srm Search-in renewal
router.route("/srmanager/get-search-renewal-srm/:id").get(get_search_renewal_srm)

//get srm Search-in monthly rent 
router.route("/srmanager/get-search-srm-monthlyrent").get(get_search_monthlyrent_srm)

//get srm Search-in monthly rent 
router.route("/srmanager/get-search-srm-monthlyrent/paid").get(get_search_monthlyrent_srm_paid)

router.route("/srmanager/dashboard/get-meta/:id").get(get_dashboard_data)




module.exports = router