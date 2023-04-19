const express = require('express');
const { user_search_srmanager, getAllAgreement, srm_get_monthly_rent, srm_get_monthly_rent_id, get_renewal_srm } = require('../controller/SRMControllers');


const router = express.Router();


//get all agreements for listing
// path /api/srmanger/getagreement/:id
router.route('/srmanager/get-agreement/:id').get(getAllAgreement)


router.route('/srmanager-search/:id').post(user_search_srmanager)

router.route('/srmanager/get-monthly-rent/:id').get(srm_get_monthly_rent)

router.route('/srmanager/get-monthly-rent-id/:id').get(srm_get_monthly_rent_id)

//get renewal list in srm
router.route("/srmanager/get-renewal-srm/:id").get(get_renewal_srm)




module.exports = router