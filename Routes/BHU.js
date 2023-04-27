const express = require('express');
const { user_search_buh, getAllAgreement, updateAgreement, getAgreementByIdBuh } = require('../controller/BHUControls');


const router = express.Router();


//get all agreements for listing
router.route('/get-agreement/:id').get(getAllAgreement)

router.route('/updateAgreement/:id').put(updateAgreement)


router.route('/search/:id').get(user_search_buh)


router.route("/get-agreement-one/:id").get(getAgreementByIdBuh)




module.exports = router