const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  { 
    categories: {
      type:[],
      ref: 'categories'
      
    },
  userId:{
      type: String,
      ref: 'users'
  },
 
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    description:{
      type: String,
    },
    images: {
      logo: String,
      poster: String,
      cover: String
    }
  },
  { timestamps: true },
  
    
);

module.exports = mongoose.model("restaurants", restaurantSchema);
