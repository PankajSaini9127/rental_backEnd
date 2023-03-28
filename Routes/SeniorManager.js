const express = require('express');
const { user_search_srmanager, getAllAgreement } = require('../controller/SRMControllers');


const router = express.Router();


//get all agreements for listing
// path /api/srmanger/getagreement/:id
router.route('/srmanager/get-agreement/:id').get(getAllAgreement)


router.route('/srmanager-search/:id').post(user_search_srmanager)




module.exports = router