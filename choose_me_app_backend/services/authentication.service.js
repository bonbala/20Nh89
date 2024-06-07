const MongoDB = require("./mongodb.service");
const { mongoConfig, tokenSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

const userRegister = async (user) => {
  try {
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      name: user?.username,  // Mapping username to name for storage
      email: user?.email,
      password: passwordHash,
      phone: "",
      address: "",
    };
    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        { name: userObject?.name, email: userObject?.email },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "User registered successfully",
        data: token,
      };
    } else {
      return {
        status: false,
        message: "User registration failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "User registration failed";
    error?.code === 11000 && error?.keyPattern?.name
      ? (errorMessage = "Username already exists")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exists")
      : null;
    return {
      status: false,
      message: errorMessage,
      error: error?.toString(),
    };
  }
};

const userLogin = async (user) => {
  try {
    if (!user?.username || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ name: user?.username }); // Querying by name
    if (userObject) {
      let isPasswordVerified = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      if (isPasswordVerified) {
        let token = jwt.sign(
          { name: userObject?.name, email: userObject?.email },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "User login successful",
          data: token,
        };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};

const checkUserExist = async (query) => {
  let messages = {
    email: "User already exists",
    name: "This username is taken",
  };
  try {
    let queryType = Object.keys(query)[0];
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne(query);
    return !userObject
      ? { status: true, message: `This ${queryType} is not taken` }
      : { status: false, message: messages[queryType] };
  } catch (error) {}
};

const tokenVerification = async (req, res, next) => {
  console.log(
    `authentication.service | tokenVerification | ${req?.originalUrl}`
  );
  try {
    if (
      req?.originalUrl.includes("/login") ||
      req?.originalUrl.includes("/user-exist") ||
      req?.originalUrl.includes("/register") ||
      req?.originalUrl.includes("/refresh-token")
    )
      return next();
    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(token, config.tokenSecret, (error, decoded) => {
        if (error) {
          res.status(401).json({
            status: false,
            message: error?.name ? error?.name : "Invalid Token",
            error: `Invalid token | ${error?.message}`,
          });
        } else {
          req["username"] = decoded?.name; // Mapping name to username for request
          next();
        }
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

const tokenRefresh = async (req, res) => {
  console.log(`authentication.service | tokenRefresh | ${req?.originalUrl}`);
  try {
    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(
        token,
        config.tokenSecret,
        { ignoreExpiration: true },
        async (error, decoded) => {
          if (error) {
            res.status(401).json({
              status: false,
              message: error?.name ? error?.name : "Invalid Token",
              error: `Invalid token | ${error?.message}`,
            });
          } else {
            if (decoded?.name && decoded?.email) {
              let newToken = jwt.sign(
                { name: decoded?.name, email: decoded?.email },
                tokenSecret,
                { expiresIn: "24h" }
              );
              res.json({
                status: true,
                message: "Token refresh successful",
                data: newToken,
              });
            } else {
              res.status(401).json({
                status: false,
                message: error?.name ? error?.name : "Invalid Token",
                error: `Invalid token | ${error?.message}`,
              });
            }
          }
        }
      );
    } else {
      res.status(401).json({
        status: false,
        message: error?.name ? error?.name : "Token missing",
        error: `Token missing | ${error?.message}`,
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.name ? error?.name : "Token refresh failed",
      error: `Token refresh failed | ${error?.message}`,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  checkUserExist,
  tokenVerification,
  tokenRefresh,
};
