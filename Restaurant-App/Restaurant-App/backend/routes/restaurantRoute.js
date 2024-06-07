const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const router = express.Router();
const adminAuthMiddleware = require("../middlewares/authMiddleware");
router.post("/restaurant/new", adminAuthMiddleware, restaurantController.addRestaurant);
router.get("/restaurants", restaurantController.getAllRestaurants);
router.get("/restaurant/:id", restaurantController.getRestaurantDetails);
router.put("/restaurant/:id", adminAuthMiddleware, restaurantController.updateRestaurant);
router.delete("/restaurant/:id", adminAuthMiddleware, restaurantController.deleteRestaurant);

module.exports = router;
