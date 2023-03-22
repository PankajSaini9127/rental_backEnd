const express = require('express');
const { SRMApproval, getAllAgreements, getagreement } = require('../controller/OperationsControls');

const router = express.Router();

const db = require("../data/db");


// path /api/operations/agreement/:id
//srManager Approval & data Send to Operations
router.route('/agreement/:id').post(SRMApproval)

// path /api/operations/get-agreements
router.route('/get-agreements').get(getAllAgreements)


// path /api/operations/getagreement/:id
//get agreement by id
router.route("/getagreement/:id").get(getagreement)

module.exports = router