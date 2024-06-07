const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getUserData = async (username) => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ name: username }); // Querying by name

    if (userObject) {
      return {
        status: true,
        message: "User found successfully",
        data: userObject,
      };
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User finding failed",
      error: `User finding failed: ${error?.message}`,
    };
  }
};

const infomationchange = async (username, phone) => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ name: username }); // Querying by name

    if (userObject) {
      // Assuming you want to update the user's phone number
      let updateResult = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .updateOne({ name: username }, { $set: { phone: phone } });

      if (updateResult.modifiedCount > 0) {
        let updatedUser = await MongoDB.db
          .collection(mongoConfig.collections.USERS)
          .findOne({ name: username }); // Querying by name again to get the updated user

        return {
          status: true,
          message: "User updated successfully",
          data: updatedUser,
        };
      } else {
        return {
          status: false,
          message: "User update failed or no changes made",
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "User finding failed",
      error: `User finding failed: ${error?.message}`,
    };
  }
};

module.exports = { getUserData, infomationchange };
