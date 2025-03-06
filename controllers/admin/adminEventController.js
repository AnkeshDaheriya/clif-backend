const Event = require("../../models/admin/eventModel");

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
      status : 200,
      message : "Event list fetched successfully",
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

module.exports.addEvent = addEvent;
module.exports.eventList = eventList;
