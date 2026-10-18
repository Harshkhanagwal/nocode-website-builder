const mongoose = require("mongoose");
const Website = require("../models/Website");
const ContactSubmission = require("../models/ContactSubmission");

const createContactSubmission = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const fields = req.body?.fields;

    if (!mongoose.isValidObjectId(websiteId)) {
      return res.status(400).json({ success: false, message: "Invalid website ID." });
    }
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
      return res.status(400).json({ success: false, message: "Contact form fields are required." });
    }

    const website = await Website.findById(websiteId).select("owner name");
    if (!website) {
      return res.status(404).json({ success: false, message: "Website not found." });
    }

    const safeFields = Object.fromEntries(
      Object.entries(fields)
        .filter(([key]) => key !== "__proto__" && key !== "constructor" && key !== "prototype")
        .slice(0, 30)
        .map(([key, value]) => [
          String(key).slice(0, 100),
          String(value ?? "").slice(0, 10000),
        ])
    );

    const submission = await ContactSubmission.create({
      website: website._id,
      owner: website.owner,
      fields: safeFields,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been received.",
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Create contact submission error:", error);
    return res.status(500).json({ success: false, message: "Failed to send your message." });
  }
};

const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find({ owner: req.user._id })
      .populate("website", "name slug")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error("Get contact submissions error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch contact submissions." });
  }
};

const updateContactSubmissionReadStatus = async (req, res) => {
  try {
    const { isRead } = req.body || {};
    if (typeof isRead !== "boolean") {
      return res.status(400).json({ success: false, message: "Read status must be true or false." });
    }

    const submission = await ContactSubmission.findOneAndUpdate(
      { _id: req.params.submissionId, owner: req.user._id },
      { $set: { isRead } },
      { new: true }
    ).select("_id isRead");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error("Update contact submission read status error:", error);
    return res.status(500).json({ success: false, message: "Failed to update message status." });
  }
};

const deleteContactSubmission = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.submissionId)) {
      return res.status(400).json({ success: false, message: "Invalid contact message ID." });
    }

    const submission = await ContactSubmission.findOneAndDelete({
      _id: req.params.submissionId,
      owner: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.status(200).json({ success: true, message: "Contact message deleted." });
  } catch (error) {
    console.error("Delete contact submission error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete contact message." });
  }
};

module.exports = {
  createContactSubmission,
  getContactSubmissions,
  updateContactSubmissionReadStatus,
  deleteContactSubmission,
};
