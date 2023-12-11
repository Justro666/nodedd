const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user_name: { type: String, max: 64, required: true },
    password: { type: String, max: 64, required: true },
    del_flg: { type: Boolean, default: false },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("m_user", userSchema);

module.exports = User;
