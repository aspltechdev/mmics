const express = require("express");

const {
  getDashboardAnalytics,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboardAnalytics
);

module.exports = router;