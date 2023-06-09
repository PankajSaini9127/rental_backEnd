const express = require('express')


const {userRegistration} = require('../controller/UserRegistration');
const { updateUser, forgotPassword, selectRole, getAllUser, updateStatus, get_user,  user_search, getMetaData, selectRoleSRM, getUser } = require('../controller/AdminControls');


const router = express.Router();

//add User
//path /api/admin/userRegistration
router.route('/userRegistration').post(userRegistration)



// update Status
// path /api/admin/updateStatus/:id
//active/ Inactive
router.route('/updateStatus/:id').put(updateStatus)


//  /api/admin/forgotPassword
router.route('/forgotPassword').post(forgotPassword)


// /api/admin/get_emp.code
// router.route('/get_emp.code').get(get_emp_code)


//api/admin/selectRole
router.route('/selectRole').post(selectRole)
//select role in senior manager
router.route('/selectRole-srm').post(selectRoleSRM)

//user Search by name
// path /api/admin/user_search
router.route('/user_search').post(user_search)


//get all user users
//path /api/admin/user

router.route('/user').post(getAllUser)

router.route('/user/spicific').post(getUser)


//get user
// path /api/admin/user/:id
router.route('/user/:id').post(get_user)



//update user users
//path /api/admin/edit/${id}
router.route('/edit/:id').put(updateUser)

// meta data 
router.route('/meta').get(getMetaData)

module.exports = router