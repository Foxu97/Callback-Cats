const { Schema, model } = require('mongoose');

const resetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAd: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300,
  },
});

const ResetToken = model('ResetToken', resetTokenSchema);

module.exports = ResetToken;
