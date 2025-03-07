const Availability = require("../../models/mentor/availabilitymodel");

exports.addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const newSlot = new Availability({ date, startTime, endTime });
    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const slots = await Availability.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Slot deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
