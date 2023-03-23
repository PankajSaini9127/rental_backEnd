const express = require('express')


const {userRegistration} = require('../controller/UserRegistration');
const { updateUser, forgotPassword, selectRole, getAllUser, updateStatus, get_user } = require('../controller/AdminControls');


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



//api/admin/selectRole
router.route('/selectRole').post(selectRole)


//get all user users
//path /api/admin/user

router.route('/user').get(getAllUser)


//get user
// path /api/admin/user/:id
router.route('/user/:id').post(get_user)



//update user users
//path /api/admin/edit/${id}
router.route('/edit/:id').put(updateUser)

module.exports = router