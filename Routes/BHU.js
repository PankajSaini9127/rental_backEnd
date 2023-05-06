const express = require('express');
const { user_search_buh, getAllAgreement, updateAgreement, getAgreementByIdBuh, get_dashboard_dats_buh, getAllAgreementApproved, get_total_agreements, user_search_buh_approved, user_search_buh_total } = require('../controller/BHUControls');


const router = express.Router();


//get all agreements for listing
router.route('/get-agreement/:id').get(getAllAgreement)

router.route('/approved/get-agreement/:id').get(getAllAgreementApproved)

router.route('/total/get-agreement/:id').get(get_total_agreements)

router.route('/updateAgreement/:id').put(updateAgreement)


router.route('/search/:id').get(user_search_buh)

router.route('/search/approved/:id').get(user_search_buh_approved)

router.route('/search/total/:id').get(user_search_buh_total)


router.route("/get-agreement-one/:id").get(getAgreementByIdBuh)


router.route("/dashboard/get-meta/:id").get(get_dashboard_dats_buh)




module.exports = router