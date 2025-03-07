const Booking = require('../../models/mentor/booking');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// VideoSDK configuration
const createBooking = async (req, res) => {
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

        // Check for existing pending booking
        const existingBooking = await Booking.findOne({
            mentorId,
            userId,
            status: 'pending'
        });

        if (existingBooking) {
            return res.status(409).json({
                message: 'You already have a pending meeting request with this mentor',
                status: false,
                data: existingBooking,
            });
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

// Get all bookings for a user
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

// Get all booking requests for a mentor
const getMentorBookings = async (req, res) => {
    try {
        const { mentorId } = req.params;
        console.log("MentorID", mentorId)
        // Find all bookings for this mentor and populate user details
        const bookings = await Booking.find({ mentorId: mentorId })
        // .populate('userId', 'name email profileImage') // Populate basic user info
        // .sort({ createdAt: -1 });
        console.log("$Bookings", bookings)
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching mentor bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new VideoSDK meeting
const createVideoSDKMeeting = async () => {
    try {
        console.log("Creating VideoSDK Meeting...");

        const SDKtoken = await generateToken();
        if (!SDKtoken) {
            throw new Error("Failed to generate VideoSDK token");
        }

        console.log("SDKToken:", SDKtoken);

        const url = `${process.env.VIDEOSDK_API_ENDPOINT}/rooms`;
        const options = {
            method: "POST",
            headers: { Authorization: SDKtoken, "Content-Type": "application/json" },
        };

        console.log("Fetch Options:", options);

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`VideoSDK API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.roomId;  // ✅ Return only roomId
    } catch (error) {
        console.error("Error creating VideoSDK Meeting:", error);
        throw error; // ✅ Throw error so it can be caught in updateBookingStatus
    }
};

// Update booking status (accept/reject)
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        console.log("Booking ID:", bookingId, "Status:", status);

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Status must be either "accepted" or "rejected"',
                success: false
            });
        }

        let meetingId = '';
        if (status === 'accepted') {
            try {
                meetingId = await createVideoSDKMeeting();  // Ensure this function is correctly implemented
                console.log("Meeting ID created:", meetingId);
            } catch (videoSdkError) {
                console.error("Error creating VideoSDK meeting:", videoSdkError);
                return res.status(500).json({
                    message: "Failed to create VideoSDK meeting",
                    success: false
                });
            }
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                status,
                meetingId: status === 'accepted' ? meetingId : ''
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found',
                success: false
            });
        }

        res.status(200).json({
            message: `Booking ${status} successfully`,
            booking,
            success: true
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};



const generateToken = (req, res) => {
    const API_KEY = process.env.VIDEOSDK_API_KEY;
    const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

    const payload = {
        apikey: API_KEY,
        permissions: ["allow_join", "allow_mod"],
    };
    // console.log("$payload", payload); 
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h', algorithm: 'HS256' });
    return res.json({
        status: 200,
        token: token,
        message: "generated token",
    })
};

const validateMeeting = async (req, res) => {
    const token = req.body.token;
    const meetingId = req.params.meetingId;

    const url = `${process.env.VIDEOSDK_API_ENDPOINT}/rooms/validate/${meetingId}`;

    const options = {
        method: "GET",
        headers: { Authorization: token },
    };

    fetch(url, options)
        .then((response) => response.json())
        .then((result) => res.json(result)) // result will contain roomId
        .catch((error) => console.error("error", error));
}


module.exports = {
    createBooking,
    getUserBookings,
    getMentorBookings,
    createVideoSDKMeeting,
    updateBookingStatus,
    generateToken,
    validateMeeting
};