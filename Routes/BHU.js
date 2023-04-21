const express = require('express');
const { user_search_buh, getAllAgreement, updateAgreement } = require('../controller/BHUControls');


const router = express.Router();


//get all agreements for listing
// path /api/srmanger/getagreement/:id
router.route('/get-agreement/:id').get(getAllAgreement)

router.route('/updateAgreement/:id').put(updateAgreement)


router.route('/search/:id').post(user_search_buh)




module.exports = router