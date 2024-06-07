var express = require("express");
const {
        getAllCategories
 } = require("../services/category.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllCategories();
  res.json(response);
});


module.exports = router;
