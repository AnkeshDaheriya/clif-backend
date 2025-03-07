const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getMentorBookings,
    updateBookingStatus,
    generateToken,
    validateMeeting,
    createVideoSDKMeeting
} = require('../../controllers/mentor/bookingController');

// Create a new booking
router.post('/bookings', createBooking);

// Get all bookings for a user
router.get('/bookings/:userId', getUserBookings);

// Get all booking requests for a mentor
router.get('/mentor-requests/:mentorId', getMentorBookings);

router.post('/createVideoSDKMeeting', createVideoSDKMeeting);

// Get bookings for a specific mentor (used in the original code to show available slots)
router.get('/bookings', async (req, res) => {
    try {
        const { mentorId } = req.query;
        if (!mentorId) {
            return res.status(400).json({ message: 'Mentor ID is required' });
        }

        // This endpoint appears to be used for checking existing bookings
        // when scheduling, so we'll just return accepted bookings
        const bookings = await Booking.find({
            mentorId,
            status: 'accepted'
        });
        console.log("bookings", bookings)
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status (accept/reject)
router.put('/update-status/:bookingId', updateBookingStatus);

router.get('/get-token', generateToken);

router.post('/validate-meeting/:meetingId', validateMeeting);

module.exports = router;