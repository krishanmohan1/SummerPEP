const userModel = require("../models/user");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).json({
      message: "All users fetched successfully",
      users: allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User fetched", user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const newUser = await userModel.create(req.body);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
