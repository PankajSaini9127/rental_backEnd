const express = require('express');
const { listing, update_landlord, search_landlord } = require('../controller/Landlord');

const router =  express.Router();

router.route('/list-landlord').get(listing)
router.route('/update-landlord').post(update_landlord)
router.route('/search-landlord').get(search_landlord)

module.exports = router