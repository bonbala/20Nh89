var express = require("express");
const { getOneFoodById,
        getAllFoods
 } = require("../services/food.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllFoods();
  res.json(response);
});

router.get("/:foodId", async (req, res) => {
  let foodId = req?.params?.foodId;
  let response = await getOneFoodById(foodId);
  res.json(response);
});

module.exports = router;
