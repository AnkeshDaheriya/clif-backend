const certificateModel = require("../../models/admin/certificateModel");

const addCertificate = async (req, res) => {
  const {
    c_name,
    C_Tags,
    c_provider,
    c_link,
    totalDuration,
    c_type,
    c_description,
  } = req.body;

  if (
    !c_name ||
    !C_Tags ||
    !c_provider ||
    !c_link ||
    !totalDuration ||
    !c_type ||
    !c_description
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const newCertificate = new certificateModel({
      certificate_name: c_name,
      certificate_tags: C_Tags,
      certificate_provider: c_provider,
      certificate_link: c_link,
      duration: totalDuration,
      certificate_type: c_type,
      certificate_description: c_description,
    });

    await newCertificate.save();
    if (newCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate added successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCertificates = async (req, res) => {
  try {
    const certificates = await certificateModel.find({
      isDeleted: false,
    });
    console.log(certificates);
    res.status(200).json({
      message: "Fetched certificate data",
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.addCertificate = addCertificate;
module.exports.getCertificates = getCertificates;
