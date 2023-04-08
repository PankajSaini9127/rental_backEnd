const express = require('express');
const { getAllAgreement, updateAgreement } = require('../controller/FinanceControls');


const router = express.Router();


//get all agreements for listing
router.route('/get-agreement/:id').get(getAllAgreement)

router.route('/updateAgreement/finance/:id').put(updateAgreement)






module.exports = router