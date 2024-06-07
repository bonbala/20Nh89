const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getAllCategories = async () => {
  try {
    let categories = await MongoDB.db
      .collection(mongoConfig.collections.CATEGORIES)
      .find()
      .toArray();

    if (categories && categories?.length > 0) {
      return {
        status: true,
        message: "categories found successfully",
        data: categories,
      };
    } else {
      return {
        status: false,
        message: "No restaurants found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurant finding failed",
      error: `Restaurant finding failed : ${error?.message}`,
    };
  }
};


module.exports = { getAllCategories };
