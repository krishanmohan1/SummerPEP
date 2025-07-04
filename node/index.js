const express = require("express");
const connection = require("./connection");
const loggerRequest = require("./middleware/log");
const userRouter = require("./routes/user");

const app = express();

//connection to db
connection()
  .then((success) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggerRequest("log.txt"));

//router
app.use("/api/users", userRouter);

// router
//     .route("/api/users")
//     .get(async (req, res) => {
//         const allusers = await userModel.find({})

//         res.status(200).json({
//             message: "all users fetched",
//             allusers
//         })
//     })
//     .post(async (req, res) => {
//         try {
//             const newUser = new userModel(req.body)
//             await newUser.save()
//             res.status(201).json({
//                 message: "new user created",
//                 newUser
//             })
//         } catch (error) {
//             res.status(400).json({
//                 error: error.message
//             })
//         }
//     });

// router
//     .route("/api/users/:id")
//     .get(async (req, res) => {
//         try {
//             const user = await userModel.findById(req.param)
//             res.status(200).json({
//                 message: "user fetched",
//                 user
//             })
//         } catch (error) {
//             res.status(400).json({
//                 error: error.message
//             })
//         }
//     })
//     .patch(async (req, res) => {
//         try {
//             const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
//                 $set: req.body
//             }, { new: true })

//             res.status(200).json({
//                 message: "user updated",
//                 updatedUser
//             })
//         } catch (error) {
//             res.status(400).json(
//                 {
//                     error: error.message
//                 }
//             )
//         }
//     })

//     .delete(async (req, res) => {
//         try {
//             const deletedUser = await userModel.findByIdAndDelete(req.params.id)
//             res.json(deletedUser);
//         } catch (error) {
//             res.status(400).json({
//                 error: error.message
//             })
//         }
//     });

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
