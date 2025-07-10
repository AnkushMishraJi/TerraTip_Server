const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Optional: pattern validation
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, 
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },

    name: {
      type: String,
      required: [true, 'Please enter name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByEmail = function (email) { return this.findOne({ email }) };

userSchema.statics.findByPhone = function (phone) { return this.findOne({ phone }) };

module.exports = mongoose.model('User', userSchema);
