const Booking = require("../../models/mentor/booking");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
require("dotenv").config();

// Create a booking
const createBooking = async (req, res) => {
  try {
    const { mentorName, mentorId, userId, date, reason } = req.body;

    // Validate input
    if (!mentorName || !userId || !date || !reason || !mentorId) {
      return res.status(400).json({ message: "All fields are required" });
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
      status: "pending",
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "You already have a pending meeting request with this mentor",
        status: false,
        data: existingBooking,
      });
    }

    const savedBooking = await booking.save();
    res.status(201).json({
      message: "Booking request submitted successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all booking requests for a mentor
const getMentorBookings = async (req, res) => {
  try {
    const { mentorId } = req.params;
    console.log("MentorID", mentorId);
    // Find all bookings for this mentor
    const bookings = await Booking.find({ mentorId: mentorId }).sort({
      createdAt: -1,
    });
    console.log("$Bookings", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching mentor bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate VideoSDK token
const generateVideoSDKToken = () => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;

  if (!API_KEY || !SECRET_KEY) {
    console.error("VideoSDK credentials missing in environment variables");
    throw new Error("VideoSDK credentials missing");
  }

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "3h",
    algorithm: "HS256",
  });

  return token;
};

// Create a new VideoSDK meeting
const createVideoSDKMeeting = async () => {
  try {
    console.log("Creating VideoSDK Meeting...");

    // Generate token for API access
    const token = generateVideoSDKToken();
    if (!token) {
      throw new Error("Failed to generate VideoSDK token");
    }

    const apiEndpoint =
      process.env.VIDEOSDK_API_ENDPOINT || "https://api.videosdk.live/v2";
    const url = `${apiEndpoint}/rooms`;

    console.log("Making request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`VideoSDK API Error (${response.status}):`, errorText);
      throw new Error(`VideoSDK API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("VideoSDK Meeting created:", result);

    if (!result.roomId) {
      throw new Error("No roomId returned from VideoSDK API");
    }

    return result.roomId;
  } catch (error) {
    console.error("Error creating VideoSDK Meeting:", error);
    throw error;
  }
};

// Update booking status (accept/reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, meetingId } = req.body;
    console.log("Booking ID:", bookingId, "Status:", status);

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message:
          'Invalid status. Status must be either "accepted" or "rejected"',
        success: false,
      });
    }

    let finalMeetingId = meetingId || "";

    // If accepting the meeting and no meetingId provided, create one
    if (status === "accepted" && !meetingId) {
      try {
        finalMeetingId = await createVideoSDKMeeting();
        console.log("Meeting ID created:", finalMeetingId);
      } catch (videoSdkError) {
        console.error("Error creating VideoSDK meeting:", videoSdkError);
        return res.status(500).json({
          message: "Failed to create VideoSDK meeting",
          success: false,
        });
      }
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status,
        meetingId: finalMeetingId,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        success: false,
      });
    }

    res.status(200).json({
      message: `Booking ${status} successfully`,
      booking,
      success: true,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Generate token for frontend
const generateToken = (req, res) => {
  try {
    const token = generateVideoSDKToken();
    return res.json({
      status: 200,
      token: token,
      message: "generated token",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to generate token",
      error: error.message,
    });
  }
};

const validateMeeting = async (req, res) => {
  try {
    const token = req.body.token;
    const meetingId = req.params.meetingId;

    if (!token || !meetingId) {
      return res.status(400).json({
        status: 400,
        message: "Token and meetingId are required",
      });
    }

    const apiEndpoint =
      process.env.VIDEOSDK_API_ENDPOINT || "https://api.videosdk.live/v2";
    const url = `${apiEndpoint}/rooms/validate/${meetingId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: token },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`VideoSDK API Error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error validating meeting:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to validate meeting",
      error: error.message,
    });
  }
};

// Create meeting endpoint for direct API access
const createMeeting = async (req, res) => {
  try {
    const meetingId = await createVideoSDKMeeting();

    res.status(200).json({
      success: true,
      message: "Meeting created successfully",
      meetingId: meetingId,
    });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create VideoSDK meeting",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getMentorBookings,
  createVideoSDKMeeting,
  updateBookingStatus,
  generateToken,
  validateMeeting,
  createMeeting,
};
