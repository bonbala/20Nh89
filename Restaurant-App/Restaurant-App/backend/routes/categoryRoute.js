const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();
const adminAuthMiddleware = require("../middlewares/authMiddleware");
router.post("/category/new", adminAuthMiddleware, categoryController.addCategory);
router.get("/categories", categoryController.getAllCategories);
router.put("/category/:id", adminAuthMiddleware, categoryController.updateCategory);
router.delete("/category/:id", adminAuthMiddleware, categoryController.deleteCategory);

module.exports = router;
