const stringSimilarity = require("string-similarity");
const Event = require("../../models/admin/eventModel");
const eventProgress = require("../../models/admin/eventProgress");

const addEvent = async (req, res) => {
  const { title, description, date, time, type, link } = req.body;

  if (!title || !description || !date || !time || !type || !link) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newEvent = new Event({
      event_name: title,
      event_description: description,
      event_data: date,
      event_time: time,
      event_type: type,
      event_link: link,
    });

    await newEvent.save();
    return res.status(201).json({
      success: true,
      message: "Event added successfully",
    });
  } catch (error) {
    console.log("Error adding event: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const eventList = async (req, res) => {
  try {
    const events = await Event.find({ isDeleted: false }).sort({
      event_date: 1,
    });
    return res.json({
      status: 200,
      message: "Event list fetched successfully",
      success: true,
      data: events,
    });
  } catch (error) {
    console.log("Error fetching events: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Event ID is required",
    });
  }
  try {
    Event.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        }
        if (!result) {
          return res.status(404).json({
            success: false,
            message: "Event not found",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Event deleted successfully",
        });
      }
    );
  } catch (error) {
    console.log("Error deleting event: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const searchEvent = async (req, res) => {
  try {
    const { query } = req.body.params;
    console.log(query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // First get potential matches using regex for better performance
    const potentialMatches = await Event.find({
      isDeleted: false,
      isEnded: false, // Exclude ended events
      $or: [
        { event_name: { $regex: query, $options: "i" } },
        { event_description: { $regex: query, $options: "i" } },
        { event_type: { $regex: query, $options: "i" } },
      ],
    });

    // If no potential matches, get a sample of recent events to compare
    console.log("Potential matches", potentialMatches);
    let eventsToScore = potentialMatches;
    if (potentialMatches.length < 5) {
      const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(50);

      // Merge and remove duplicates based on event _id
      const combinedEvents = [...potentialMatches, ...recentEvents];
      eventsToScore = combinedEvents.filter(
        (event, index, self) =>
          index ===
          self.findIndex((e) => e._id.toString() === event._id.toString())
      );
    }

    // Calculate similarity scores
    const scoredEvents = eventsToScore.map((event) => {
      // Create a comprehensive text representation of the event
      const eventText = `${event.event_name || ""} ${
        event.event_description || ""
      } ${event.event_type || ""} ${event.event_time || ""} ${
        event.event_data || ""
      }`.toLowerCase();

      // Calculate similarity
      const similarityScore =
        stringSimilarity.compareTwoStrings(query.toLowerCase(), eventText) *
        100; // Convert to 0-100 scale

      // Final score (you can add more custom boosts here if needed)
      const finalScore = Math.min(100, similarityScore);

      return {
        ...event.toObject(),
        relevanceScore: finalScore,
      };
    });

    // Sort by similarity score and filter out low-relevance results
    const sortedEvents = scoredEvents
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter((event) => event.relevanceScore > 25); // Minimum relevance threshold

    console.log(sortedEvents);

    res.json({
      success: true,
      events: sortedEvents,
    });
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching event details",
      error: error.message,
    });
  }
};

module.exports.addEvent = addEvent;
module.exports.eventList = eventList;
module.exports.deleteEvent = deleteEvent;
module.exports.searchEvent = searchEvent;

// events controls

const getEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    return res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getEventProgress = async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    // console.log(`${eventId} - ${userId}}`)
    const progress = await eventProgress.findOne({
      eventId: eventId,
      userId: userId,
    });
    return res.json({
      success: true,
      message: "Progress of event",
      data: progress,
    });
  } catch (error) {
    console.error("Error fetching event progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateEventProgress = async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    const newEventProgress = await eventProgress.create({
      eventId : eventId,
      userId : userId,
      isAttended : true,
    })
    newEventProgress.save();
    return res.json({
      success: true,
      message: "Progress of event updated successfully",
    });
  } catch (error) {
    console.error("Error updating event progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error (update Event Progress)",
    });
  }
};

module.exports.getEvent = getEvent;
module.exports.getEventProgress = getEventProgress;
module.exports.updateEventProgress = updateEventProgress;