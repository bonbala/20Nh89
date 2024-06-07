const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    categories: {
      type:[],
      ref: 'categories'
      
    },
    price: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      
    },
    restaurantId: {
      type: String,
      ref: 'restaurants',

    },
    ingredients: {
      type: String,

    }
    
  },
  { timestamps: true }

);

module.exports = mongoose.model("foods", foodSchema);
