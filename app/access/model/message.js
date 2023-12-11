const mongoose = require("mongoose");
const { Schema,model } = mongoose;

const messageSchema = new Schema(
  {
    sender:{type: Schema.Types.ObjectId,ref:"m_user",required:true},
    receiver:{type :Schema.Types.ObjectId,ref:"m_user",required:true},
    type: {type:String,enum:["text","image"],default:"text"},
    msg:{type:String,required:true},
    is_deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

messageSchema.pre("find", function() {
  this.where({ is_deleted: false });
});

messageSchema.pre("findOne", function() {
  this.where({ is_deleted: false });
});
messageSchema.pre("countDocuments", function() {
  this.where({ is_deleted: false });
});
messageSchema.pre("findById", function() {
  this.where({ is_deleted: false });
});

module.exports = model("message", messageSchema);
