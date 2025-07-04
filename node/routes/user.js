const express = require("express");
const userRouter = express.Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

// Route: GET /users
userRouter.get("/", getAllUsers);

// Route: GET /users/:id
userRouter.get("/:id", getUserById);

// Route: POST /users
userRouter.post("/", createUser);

// Route: PATCH /users/:id
userRouter.patch("/:id", updateUser);

// Route: DELETE /users/:id
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
