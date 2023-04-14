const express = require("express");
const multer = require("multer");
const {
  newAgreement,
  getAllAgreement,
  getAgreementById,
  detailsAgreement,
  editAgreement,
  updateAgreement,
  deleteAgreement,
  add_landlord,
  uploadDoc,
  get_tenure,
  get_monthly_rent,
  getStateList,
  getCityList,
  user_search_manager,
  get_agreement_details,
  send_back,
  get_status,
  set_final_agreement
} = require("../controller/ManagerController");
const { add_rent, get_landlord_id, list_month_rent ,add_invoice, update_payment_status} = require("../controller/MontlyRent");

// setting up multer for file transport 
const router = express.Router();
// middleware for the multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// check on files
const fileFilter = (req, file, cb) => {
  // for removing the space between the image file name to save it properly for URL
  file.originalname = file.originalname.replace(/ /g, "");
  console.log(file);
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "text/csv" ||
    file.mimetype === "application/pdf" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    if (file.fieldname === "COD_File") {
      file.originalname = "currentCSV.csv";
    }
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// multer fields and configurations here
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).fields([
  { name: "photo" },
]);


// Post request in agreements table
// path /api/newAgreement
router.route("/newAgreement").post(newAgreement);
// router.route().post();

router.post("/uploadDoc",upload,uploadDoc)

router.route("/add_landlord").post(add_landlord)

//get request in agreements table
// path /api/agreements
router.route("/agreements").get(getAllAgreement);

//post request in agreements table get agreemennt by id
// path /api/agreement/:id
// router.route("/agreement/:id").post(getAgreementById);
router.route("/getDetails").get(getAgreementById);



router.route("/agreement/:id").post(get_agreement_details);


//send back
//path /api/send-back/:id
router.route("/send-back/:id").put(send_back)


//Update API
//Update Request in agreement table
// path /api/updateAgreement/:id
router.route("/updateAgreement/:id").put(updateAgreement);

// delete agreemenet in agreemenets table
// path /api/delAgreement/:id
router.route("/delAgreement/:id").delete(deleteAgreement);

//   /api/list_tenure
router.route('/list_teure').get(get_tenure)

// /api/list_monthly
router.route('/list_monthly/:id').get(get_monthly_rent)

// /api/stateList 
// Api for getting state list
router.route('/stateList').get(getStateList)

// Api for getting state list
router.route('/cityList').get(getCityList)

// edit agreement API
router.route('/editAgreement').patch(editAgreement)

//search value 
router.route('/search/manager').post(user_search_manager)

//get meta data dashboard
router.route('/dashboard/get-meta').get(get_status)


//monthaly Rent 
router.route('/monthly_rent/add').post(add_rent)

//get landlord id 
router.route('/month_rent/get_landlord_id/:id').get(get_landlord_id)

// API for setting up the final agreement
router.route('/setFinalAgreement').post(set_final_agreement)

// API for list 
router.route('/listMonthRent').get(list_month_rent)

router.route('/add_invoice/:id').put(add_invoice)

router.route('/sent-monthly-payment/:id').put(update_payment_status)

module.exports = router;
