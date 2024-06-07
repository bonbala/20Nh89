const Users = require("../models/userModel");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    let user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    await user.remove();
    res.status(200).json({ message: "This user has been deleted" });
  },
  updateUser: async (req, res) => {
    try {
      let user = await Users.findById(req.params.id);
      if (!user)
        return res.status(400).json({ message: "This item does not exist" });
      user = await Users.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Successfully updated", user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
