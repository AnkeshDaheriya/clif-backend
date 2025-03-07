const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getMentorBookings,
  updateBookingStatus,
  generateToken,
  validateMeeting,
  createMeeting,
} = require("../../controllers/mentor/bookingController");

// Import Booking model for the /bookings route
const Booking = require("../../models/mentor/booking");

// Create a new booking
router.post("/bookings", createBooking);

// Get all bookings for a user
router.get("/bookings/:userId", getUserBookings);

// Get all booking requests for a mentor
router.get("/mentor-requests/:mentorId", getMentorBookings);

// Direct endpoint to create a VideoSDK meeting (for testing or direct use)
router.post("/create-meeting", createMeeting);

// Get bookings for a specific mentor (used in the original code to show available slots)
router.get("/bookings", async (req, res) => {
  try {
    const { mentorId } = req.query;
    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    // This endpoint appears to be used for checking existing bookings
    // when scheduling, so we'll just return accepted bookings
    const bookings = await Booking.find({
      mentorId,
      status: "accepted",
    });
    console.log("bookings", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status (accept/reject)
router.put("/update-status/:bookingId", updateBookingStatus);

// Get VideoSDK token for frontend
router.get("/get-token", generateToken);

// Validate a meeting room
router.post("/validate-meeting/:meetingId", validateMeeting);

module.exports = router;
