const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strict", false);
    await mongoose.connect("mongodb://localhost:27017/default_node");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
