const mongoose = require('mongoose');
const { Schema } = mongoose;

const unreadSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "m_user", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "m_user", required: true },
    is_deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

unreadSchema.pre('find', function() {
  this.where({ is_deleted: false });
});

unreadSchema.pre('findOne', function() {
  this.where({ is_deleted: false });
});

unreadSchema.pre('countDocuments', function() {
  this.where({ is_deleted: false });
});

unreadSchema.pre('findById', function() {
  this.where({ is_deleted: false });
});

module.exports = mongoose.model('unread_message', unreadSchema);