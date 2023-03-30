const express = require('express');
const { user_search_bhu, getAllAgreement } = require('../controller/OperationsControls');


const router = express.Router();


//get all agreements for listing
// path /api/srmanger/getagreement/:id
router.route('/get-agreement/:id').get(getAllAgreement)


router.route('/search/:id').post(user_search_bhu)




module.exports = router