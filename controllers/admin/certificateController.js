const stringSimilarity = require("string-similarity");
const certificateModel = require("../../models/admin/certificateModel");
const certificateProgress = require("../../models/admin/certificateProgress");

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

// certificate controller
const searchCertificates = async (req, res) => {
  try {
    // console.log("req.body.params", req.body);
    const { query } = req.body.params;
    console.log(query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // First get potential matches using regex for better performance
    const potentialMatches = await certificateModel.find({
      isDeleted: false,
      $or: [
        { certificate_name: { $regex: query, $options: "i" } },
        { certificate_description: { $regex: query, $options: "i" } },
        { certificate_tags: { $regex: query, $options: "i" } },
        { certificate_provider: { $regex: query, $options: "i" } },
      ],
    });

    // If no potential matches, get a sample of recent certificates to compare
    console.log("Potential matches", potentialMatches);
    let certificatesToScore = potentialMatches;
    if (potentialMatches.length < 5) {
      const recentCertificates = await certificateModel
        .find()
        .sort({ createdAt: -1 })
        .limit(50);

      // Merge and remove duplicates based on certificate _id
      const combinedCertificates = [...potentialMatches, ...recentCertificates];
      certificatesToScore = combinedCertificates.filter(
        (certificate, index, self) =>
          index ===
          self.findIndex((c) => c._id.toString() === certificate._id.toString())
      );
    }

    // Calculate similarity scores
    const scoredCertificates = certificatesToScore.map((certificate) => {
      // Create a comprehensive text representation of the certificate
      const certificateText = `${certificate.certificate_name || ""} ${
        certificate.certificate_description || ""
      } ${certificate.certificate_provider || ""} ${
        certificate.certificate_tags.join(" ") || ""
      } ${certificate.certificate_type || ""}`.toLowerCase();

      // Calculate similarity
      const similarityScore =
        stringSimilarity.compareTwoStrings(
          query.toLowerCase(),
          certificateText
        ) * 100; // Convert to 0-100 scale

      // Apply additional weighting for tags match
      let tagBoost = 0;

      // Check if tags exist before splitting
      if (certificate.certificate_tags.length > 0) {
        if (
          certificate.certificate_tags.some(
            (tag) =>
              query.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(query.toLowerCase())
          )
        ) {
          tagBoost = 20; // Boost score if query directly relates to certificate tags
        }
      }

      // Apply provider boost - check if provider exists
      const providerBoost =
        certificate.certificate_provider &&
        certificate.certificate_provider
          .toLowerCase()
          .includes(query.toLowerCase())
          ? 15
          : 0;

      // Final score with boosts
      const finalScore = Math.min(
        100,
        similarityScore + tagBoost + providerBoost
      );

      return {
        ...certificate.toObject(),
        relevanceScore: finalScore,
      };
    });

    // Sort by similarity score and filter out low-relevance results
    const sortedCertificates = scoredCertificates
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter((certificate) => certificate.relevanceScore > 25); // Minimum relevance threshold

    console.log(sortedCertificates);

    res.json({
      success: true,
      certificates: sortedCertificates,
    });
  } catch (error) {
    console.error("Error searching certificates:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching certificate details",
      error: error.message,
    });
  }
};

const getCertificateById = async (req, res) => {
  const { certificateId } = req.body;
  console.log("CertificateID", certificateId);
  try {
    const certificate = await certificateModel.findById({
      _id: certificateId,
    });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("Error getting certificate:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching certificate details",
      error: error.message,
    });
  }
};

const updateCertificate = async (req, res) => {
  const { certificateId, userId } = req.body;
  try {
    const progress = await certificateProgress.create({
      userId: userId,
      certificateId: certificateId,
      isCompleted: true,
    });
    if (progress) {
      return res.status(200).json({
        success: true,
        message: "Certificate updated successfully",
        data: progress,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error (updating certificate)",
      });
    }
  } catch (error) {
    console.error("Error updating certificate:", error);
    res.status(500).json({
      success: false,
      message: "Error updating certificate",
      error: error.message,
    });
  }
};

const getCertificateProgress = async(req,res)=>{
  const { userId, certificateId } = req.body;
  try {
    const progress = await certificateProgress.findOne({
      userId: userId,
      certificateId: certificateId,
    });
    if (!progress) {
      return res.status(200).json({
        success: true,
        message: [],
      });
    }
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error getting certificate progress:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching certificate progress",
      error: error.message,
    });
  }
}

module.exports.search = searchCertificates;
module.exports.getCertificateById = getCertificateById;
module.exports.updateCertificate = updateCertificate;
module.exports.getCertificateProgress = getCertificateProgress;