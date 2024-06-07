const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("Database is successfully connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
// mongodb+srv://hohuyen712002:1234567890@huyn.x1hf2z0.mongodb.net/usedb