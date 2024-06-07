const Restaurants = require("../models/restaurantModel");
const { addRestaurantErrorHandler } = require("../utils/errorHandler");

const restaurantController = {
  addRestaurant: async (req, res) => {
    try {
      const { name, categories, location, email, phone, userId, images, description} = req.body;
      const { logo, poster, cover } = images; // Destructure from images object
      const errorMessage = addRestaurantErrorHandler(
        name,
        categories,
        location,
        email, 
        phone, 
        logo, // Nếu logo được gửi trong yêu cầu, sử dụng đường dẫn của nó, nếu không, để trống
        poster, // Tương tự cho poster
        cover,
        userId,
        description
      );
      if (errorMessage) return res.status(400).json({ message: errorMessage });
      const restaurant = await new Restaurants({
        name,
        categories,
        location,
        email, 
        phone, 
        images: {
        logo, // Nếu logo được gửi trong yêu cầu, sử dụng đường dẫn của nó, nếu không, để trống
        poster, // Tương tự cho poster
        cover,
        },
        userId,
        description
      }).save();
      res.status(201).json({ message: "Successfully added new Restaurant", restaurant });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurants.find();
      res.status(200).json({ restaurants });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getRestaurantDetails: async (req, res) => {
    try {
      const restaurant = await Restaurants.findById(req.params.id);
      if (!restaurant)
        return res.status(400).json({ message: "This item does not exist" });
      res.status(200).json({ restaurant });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurants.findById(req.params.id);
      if (!restaurant)
        return res.status(400).json({ message: "This item does not exist" });
      restaurant = await Restaurants.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Successfully updated", restaurant });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      let restaurant = await Restaurants.findById(req.params.id);
      if (!restaurant)
        return res.status(400).json({ message: "This item does not exist" });
      restaurant.remove();
      res.status(200).json({ message: "Item is successfully deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = restaurantController;
