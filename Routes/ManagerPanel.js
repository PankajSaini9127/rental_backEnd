const express = require("express");
const {
  newAgreement,
  getAllAgreement,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
} = require("../controller/ManagerController");



const router = express.Router();

// Post request in agreements table
// path /api/newAgreement
router.route("/newAgreement").post(newAgreement);

//get request in agreements table
// path /api/agreements
router.route("/agreements").get(getAllAgreement);

//post request in agreements table get agreemennt by id
// path /api/agreement
router.route("/agreement/:id").post(getAgreementById);

//Update API
//Update Request in agreement table
// path /api/updateAgreement/:id
router.route("/updateAgreement/:id").put(updateAgreement);

// delete agreemenet in agreemenets table
// path /api/delAgreement/:id
router.route("/delAgreement/:id").delete(deleteAgreement);

module.exports = router;
