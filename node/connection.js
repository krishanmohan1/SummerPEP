const mongoose = require("mongoose");

const url =
  "mongodb+srv://krishanmohan1266:C7La6gbsUGZEDQjR@cluster0.eus39lx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connection = async () => {
  return mongoose.connect(url);
};

module.exports = connection;
