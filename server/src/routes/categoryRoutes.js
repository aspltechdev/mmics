const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  changeCategoryStatus,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Public GET routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin-only management
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCategory
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  changeCategoryStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCategory
);

module.exports = router;