const { response } = require("express");
const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");
const { ObjectId } = require('mongodb');

const getAllRestaurant = async () => {
  try {
    let restaurants = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .find()
      .toArray();

    if (restaurants && restaurants?.length > 0) {
      return {
        status: true,
        message: "Restaurants found successfully",
        data: restaurants,
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

const getOneRestaurantById = async (restaurantId) => {
  try {
    let restaurant = await MongoDB.db
      .collection(mongoConfig.collections.RESTAURANTS)
      .aggregate([
        {
          $match: {
            _id: ObjectId(restaurantId), // Ensure the restaurantId is an ObjectId
          },
        },
        {
          $lookup: {
            from: "foods",
            let: { restaurantId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurantId", { $toString: "$$restaurantId" }],
                  },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { categoryIds: "$categories" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ["$_id", { $map: { input: "$$categoryIds", as: "categoryId", in: { $toObjectId: "$$categoryId" } } }]
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        name: 1,
                      },
                    },
                  ],
                  as: "categoryNames",
                },
              },
              {
                $addFields: {
                  categories: "$categoryNames.name",
                },
              },
              {
                $project: {
                  categoryNames: 0,
                },
              },
            ],
            as: "foods",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { categoryIds: "$categories" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", { $map: { input: "$$categoryIds", as: "categoryId", in: { $toObjectId: "$$categoryId" } } }]
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  name: 1,
                },
              },
            ],
            as: "categoryNames",
          },
        },
        {
          $addFields: {
            categories: "$categoryNames.name",
          },
        },
        {
          $project: {
            categoryNames: 0,
          },
        },
      ])
      .toArray();
      
    if (restaurant && restaurant?.length > 0) {
      return {
        status: true,
        message: "Restaurant found successfully",
        data: restaurant[0],
      };
    } else {
      return {
        status: false,
        message: "No restaurant found",
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

module.exports = { getAllRestaurant, getOneRestaurantById };
