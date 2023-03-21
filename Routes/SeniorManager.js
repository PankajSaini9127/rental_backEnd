const express = require('express');
const { managerApproval, getAgreements, getAgreementSRM } = require('../controller/SRMControllers');
const db = require('../data/db');

const router = express.Router();


router.route('/').get((req,res)=>{
    res.send('senior manager route')
})


//Approved by manager & send to manager
//path /api/srmanager/:id
router.route('/srmanger/agreement/:id').post(managerApproval)


//getAll the agreements in srmanager listing
// path /api/srmanager/agreement
router.route('/srmanager/agreement').get(getAgreements)


//srm get agreement by id
// path /api/srmanager/agreement/id
router.route('/srmanager/agreement/:id').get(getAgreementSRM)


module.exports = router