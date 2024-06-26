const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userId:{
      type: String,
      ref: 'users'
  },
},
  { timestamps: true }


);

module.exports = mongoose.model("categories", categorySchema);
