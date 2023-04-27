const express = require('express');
const { getAllAgreement, updateAgreement, finance_get_monthly_rent,
    insertRecoveryLog,
    getRecoveryLog,
    finance_agreement_search
} = require('../controller/FinanceControls');


const router = express.Router();


//get all agreements for listing
router.route('/get-agreement/:id').get(getAllAgreement)

router.route('/search/:id').get(finance_agreement_search)

router.route('/updateAgreement/finance/:id').put(updateAgreement)

router.route('/finance-monthly-rent/:id').get(finance_get_monthly_rent)


router.route('/insertRecoveryLog').post(insertRecoveryLog)
router.route('/getRecoveryLog').get(getRecoveryLog)




module.exports = router