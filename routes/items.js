const express = require("express");
const router = express.Router();

const {
  getItems,
  createItem,
  getItemById,
  deleteItem,
  ItemPhotoUpload,
} = require("../controllers/items");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getItems)
  .post(protect, authorize("admin", "user"), createItem);

router
  .route("/:id/photo")
  .put(protect, authorize("user", "admin"), ItemPhotoUpload);

router
  .route("/:id")
  .get(getItemById)
  .delete(protect, authorize("user", "admin"), deleteItem);

module.exports = router;
