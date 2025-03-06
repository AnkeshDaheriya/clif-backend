const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../../controllers/mentor/bookingController');
const Booking = require('../../models/mentor/booking');
const axios = require('axios');

router.post('/bookings', createBooking);
router.get('/bookings/:userId', getUserBookings);

module.exports = router;