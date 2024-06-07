const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const getOneFoodById = async (foodId) => {
  try {
    let food = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .findOne({ _id: ObjectId(foodId) });
    if (food) {
      let categoryNames = food.categories.map(async (categoryId) => {
        let categoryDetail = await MongoDB.db
          .collection(mongoConfig.collections.CATEGORIES)
          .findOne({ _id: ObjectId(categoryId) });
        return categoryDetail ? categoryDetail.name : null;
      });

      // Replace category IDs with names
      food.categories = await Promise.all(categoryNames);
      return {
        status: true,
        message: "Food found successfully",
        data: food,
      };
    } else {
      return {
        status: false,
        message: "No Food found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};
const getAllFoods = async () => {
  try {
    let foods = await MongoDB.db
      .collection(mongoConfig.collections.FOODS)
      .find()
      .toArray();

    if (foods && foods.length > 0) {
      // Iterate over all food items
      for (let i = 0; i < foods.length; i++) {
        // Get the category names for each food item
        let categoryNames = foods[i].categories.map(async (categoryId) => {
          let categoryDetail = await MongoDB.db
            .collection(mongoConfig.collections.CATEGORIES)
            .findOne({ _id: ObjectId(categoryId) });
          return categoryDetail ? categoryDetail.name : null;
        });

        // Replace category IDs with names
        foods[i].categories = await Promise.all(categoryNames);
      }

      return {
        status: true,
        message: "Foods found successfully",
        data: foods,
      };
    } else {
      return {
        status: false,
        message: "No foods found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getAllFoods,getOneFoodById };
