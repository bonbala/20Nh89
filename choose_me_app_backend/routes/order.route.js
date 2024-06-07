var express = require("express");
const { getOrders, createOrder, removeCartItems } = require("../services/order.service");
var router = express.Router();

router.post("/:username", async (req, res) => {
  let { username } = req.params;
  let { restaurantId } = req.body;
  let response = await createOrder({ username, restaurantId });
  res.json(response);
});

router.get("/:username", async (req, res) => {
  let { username } = req.params;
  let response = await getOrders({ username });
  res.json(response);
});

router.delete("/:username", async (req, res) => {
  let { username } = req.params;
  let { restaurantId } = req.body;
  let response = await removeCartItems({ username, restaurantId });
  res.json(response);
});

module.exports = router;
