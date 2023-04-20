const express = require('express');
const { user_search_bhu, getAllAgreement, get_monthly_rent_opr, get_monthly_search_opr } = require('../controller/OperationsControls');


const router = express.Router();


//get all agreements for listing
// path /api/getagreement/:id
router.route('/get-agreement/:id').get(getAllAgreement)


router.route('/search/:id').post(user_search_bhu)

router.route('/opr-monthly-payment/:id').get(get_monthly_rent_opr)

router.route('/get-search-operations-monthlyrent').get(get_monthly_search_opr)


module.exports = router