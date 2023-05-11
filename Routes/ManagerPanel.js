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
  set_final_agreement,
  get_renewal_list,
  get_agreement_id_renewal,
  get_deposit_amount,
  get_search_renewal_manager,
  insertAdjustmentAmount,
  get_data_from_recovery,
  get_modify_date,
  get_payment_update_date,
  get_all_approved_ag,
  get_all__ag,
  user_search_manager_approved,
  user_search_manager_inProcess,
  add_renewal_deposit,
  get_old_agreement,
  get_data_from_recovery_renewal,
  getallManager,
  getAllEmployeeList,
  get_old_ag,
  get_search_old_ag
  
} = require("../controller/ManagerController");

const { add_rent, get_landlord_id, list_month_rent ,add_invoice, update_payment_status, get_agreements_code, invoice_number_verification, list_month_rent_paid, list_month_rent_search, list_month_rent_paid_search} = require("../controller/MontlyRent");

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
router.route("/agreements/:manager_id").get(getAllAgreement);

//approved agreements
router.route("/agreements/approved/:manager_id").get(get_all_approved_ag)

//toal agreements
router.route("/agreements/total/:manager_id").get(get_all__ag)

//old agreements
router.route("/agreements/old/:manager_id").get(get_old_ag)

//post request in agreements table get agreemennt by id
// path /api/agreement/:id
// router.route("/agreement/:id").post(getAgreementById);
router.route("/getDetails").get(getAgreementById);


router.route("/getDetails-renewal").get(get_agreement_id_renewal);



//get deposite amount 
router.route("/get-deposit-amount").get(get_deposit_amount)

//get search in renewal manager
router.route("/get-search-renewal/:id").get(get_search_renewal_manager)

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

router.route('/search/approved/manager').post(user_search_manager_approved)

router.route('/search/in-process/manager').post(user_search_manager_inProcess)

router.route('/search/old/manager').post(get_search_old_ag)

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

// monthly paid payment
router.route('/listMonthRent/paid/:manager_id').get(list_month_rent_paid)



router.route('/add_invoice/:id').put(add_invoice)

router.route('/sent-monthly-payment/:id').put(update_payment_status)

router.route('/get-monthly-rent-by-code/:id').get(get_agreements_code)

//invoice number validation
router.route('/get-invoice-number-validate/:invoice').get(invoice_number_verification)

//renewal listing data
router.route('/get-renewal-list/:id').get(get_renewal_list)

//renewal listing data
router.route('/insertAdjustmentAmount').post(insertAdjustmentAmount)

//list data 
router.route('/get-data-recovery/:id').get(get_data_from_recovery)

//renewal recovery data
router.route('/get-data-recovery-renewal/:id').get(get_data_from_recovery_renewal)

//get latest modification date
router.route('/get-modify-date').get(get_modify_date)

//get latest payment modification
router.route('/get-payment-modify-date').get(get_payment_update_date)

//get latest payment modification
router.route('/add-renewal-deposit').post(add_renewal_deposit)


//get old agreements value
router.route('/old/agreements').get(get_old_agreement)

//search in monthly rent inn process
router.route("/get-search-manager-monthlyrent").get(list_month_rent_search)


//search in monthly rent paid
router.route("/get-search-manager-monthlyrent/paid").get(list_month_rent_paid_search)


//get all manager
router.route("/get-all-manager").get(getallManager)

//get all supervisor by id
router.route("/get-all-employee-list").get(getAllEmployeeList)


module.exports = router;
