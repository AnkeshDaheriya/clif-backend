const Booking = require('../../models/mentor/booking');

// Create a new booking
const createBooking = async (req, res) => {
    // console.log("$Req", req.body);
    try {
        const { mentorName, mentorId, userId, date, reason } = req.body;

        // Validate input
        if (!mentorName || !userId || !date || !reason || !mentorId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const booking = new Booking({
            mentorId,
            mentorName,
            userId,
            date,
            reason,
        });
        const existingBooking = await Booking.find({
            mentorId,
            mentorName,
            userId,
        });
        console.log("existing meetings", existingBooking);
        if (existingBooking.status === 'pending') {
            return res.status(409).json({
                message: 'Your meeting is pending',
                status: false,
                data: existingBooking,
            })
        }
        const savedBooking = await booking.save();
        res.status(201).json({
            message: 'Booking request submitted successfully',
            booking: savedBooking,
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings for a user (optional)
const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createBooking, getUserBookings };