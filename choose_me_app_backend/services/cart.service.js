const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const addToCart = async ({ foodId, restaurantId, username }) => {
  try {
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, restaurantId, username },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Added to Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Cart Failed",
    };
  }
};

const removeFromCart = async ({ foodId, username }) => {
  try {
    let cart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .findOne({ foodId, username, count: 1 });
    if (cart) {
      await MongoDB.db
        .collection(mongoConfig.collections.CARTS)
        .deleteOne({ foodId, username });
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .updateOne(
        { foodId, username },
        { $inc: { count: -1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Removed from Cart Failed",
    };
  }
};


const getCartItems = async ({ username }) => {
  try {
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $addFields: {
            foodId: { $toObjectId: "$foodId" },
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "foodId",
            foreignField: "_id",
            as: "food",
          },
        },
        {
          $unwind: {
            path: "$food",
          },
        },
      ])
      .toArray();
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      return {
        status: true,
        message: "Cart items fetched Successfully",
        data: {
          cartItems,
          metaData: {
            itemsTotal,
            discount,
            grandTotal: itemsTotal - discount,
          },
        },
      };
    } else {
      return {
        status: false,
        message: "Cart items not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Cart items fetched Failed",
    };
  }
};

const getCartRestaurant = async ({ username }) => {
  try {
    let cartRestaurant = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $addFields: {
            restaurantId: { $toObjectId: "$restaurantId" },
          },
        },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurantId",
            foreignField: "_id", // Ensure the field is correct
            as: "restaurants",
          },
        },
        {
          $unwind: "$restaurants",
        },
      ])
      .toArray();
    if (cartRestaurant?.length > 0) {
      return {
        status: true,
        message: "Cart Restaurants fetched Successfully",
        data: {
          cartRestaurant,
        },
      };
    } else {
      return {
        status: false,
        message: "Cart Restaurants not found",
      };
    }
  } catch (error) {
    console.error('Error fetching cart restaurants:', error);
    return {
      status: false,
      message: "Cart Restaurants fetched Failed",
    };
  }
};


const getCartItemsByRestaurant = async ({ username, restaurantId }) => {
  try {
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .aggregate([
        {
          $match: {
            username: username,
            restaurantId: restaurantId,
          },
        },
        {
          $addFields: {
            foodId: { $toObjectId: "$foodId" },
            restaurantId: { $toObjectId: "$restaurantId" },
          },
        },
        {
          $lookup: {
            from: "foods",
            localField: "foodId",
            foreignField: "_id", // Ensure the field is correct
            as: "food",
          },
        },
        {
          $unwind: "$food",
        },
      ])
      .toArray();
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      let discount = 0;
      return {
        status: true,
        message: "Cart items fetched Successfully",
        data: {
          cartItems,
          metaData: {
            itemsTotal,
            discount,
            grandTotal: itemsTotal - discount,
          },
        },
      };
    } else {
      return {
        status: false,
        message: "Cart items not found",
      };
    }
  } catch (error) {
    console.error('Error fetching cart items by restaurant:', error);
    return {
      status: false,
      message: "Cart items fetched Failed",
    };
  }
};


module.exports = { addToCart, removeFromCart, getCartItems,getCartRestaurant,getCartItemsByRestaurant };
