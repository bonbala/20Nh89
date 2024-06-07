const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const createOrder = async ({ username, restaurantId }) => {
  try {
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .find({ username, restaurantId })
      .toArray();

    if (cartItems.length === 0) {
      return { status: false, message: "No items in cart to order from this restaurant" };
    }

    let order = {
      username,
      restaurantId,
      cartItems,
      createdAt: new Date(),
    };

    let result = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .insertOne(order);

    if (result.insertedCount > 0) {
      await removeCartItems({ username, restaurantId });
      return {
        status: true,
        message: "Order placed successfully",
        data: order,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Order creation failed",
      error,
    };
  }
};

const removeCartItems = async ({ username, restaurantId }) => {
  try {
    await MongoDB.db
      .collection(mongoConfig.collections.CARTS)
      .deleteMany({ username, restaurantId });
    return {
      status: true,
      message: "Cart items removed successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: "Removing cart items failed",
      error,
    };
  }
};

const getOrders = async ({ username }) => {
  try {
    let orders = await MongoDB.db
      .collection(mongoConfig.collections.ORDERS)
      .find({ username })
      .toArray();

    if (orders.length > 0) {
      return {
        status: true,
        message: "Orders fetched successfully",
        data: orders,
      };
    } else {
      return {
        status: false,
        message: "No orders found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Fetching orders failed",
      error,
    };
  }
};

module.exports = { createOrder, getOrders, removeCartItems }
