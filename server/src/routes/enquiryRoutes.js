const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

// Contact / Product enquiry
router.post("/", createEnquiry);

// =====================================================
// ADMIN
// =====================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEnquiries
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getEnquiry
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateEnquiryStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteEnquiry
);

module.exports = router;