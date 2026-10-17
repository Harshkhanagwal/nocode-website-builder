const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createContactSubmission,
  getContactSubmissions,
  updateContactSubmissionReadStatus,
  deleteContactSubmission,
} = require("../controllers/contactSubmissionController");

const router = express.Router();

router.post("/websites/:websiteId/contact-submissions", createContactSubmission);
router.get("/contact-submissions", authMiddleware, getContactSubmissions);
router.patch("/contact-submissions/:submissionId/read", authMiddleware, updateContactSubmissionReadStatus);
router.delete("/contact-submissions/:submissionId", authMiddleware, deleteContactSubmission);

module.exports = router;
