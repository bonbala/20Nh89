const Categories = require("../models/categoryModel");
const { addCategoryErrorHandler } = require("../utils/errorHandler");

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name, userId} = req.body;
      const errorMessage = addCategoryErrorHandler(
        name,
        userId
      );
      if (errorMessage) return res.status(400).json({ message: errorMessage });
      const category = await new Categories({
        name,
        userId
      }).save();
      res.status(201).json({ message: "Successfully added new Category", category });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Categories.find();
      res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      let category = await Categories.findById(req.params.id);
      if (!category)
        return res.status(400).json({ message: "This item does not exist" });
      category = await Categories.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Successfully updated", category });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      let category = await Categories.findById(req.params.id);
      if (!category)
        return res.status(400).json({ message: "This item does not exist" });
      category.remove();
      res.status(200).json({ message: "Item is successfully deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
