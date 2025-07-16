/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Please enter phone number'],
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
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

// Static methods
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone });
};

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('email') && this.email) {
      const existingEmail = await this.constructor.findOne({ email: this.email });
      if (existingEmail && existingEmail._id.toString() !== this._id.toString()) {
        const error = new Error('Email already exists');
        error.statusCode = 409;
        return next(error);
      }
    }

    if (this.isModified('phone')) {
      const existingPhone = await this.constructor.findOne({ phone: this.phone });
      if (existingPhone && existingPhone._id.toString() !== this._id.toString()) {
        const error = new Error('Phone number already exists');
        error.statusCode = 409;
        return next(error);
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre('findOneAndUpdate', async (next) => {
  try {
    const update = this.getUpdate();
    const query = this.getQuery();

    if (update.email) {
      const existingEmail = await this.model.findOne({
        email: update.email,
        _id: { $ne: query._id || this.getQuery()._id },
      });
      if (existingEmail) {
        const error = new Error('Email already exists');
        error.statusCode = 409;
        return next(error);
      }
    }

    if (update.phone) {
      const existingPhone = await this.model.findOne({
        phone: update.phone,
        _id: { $ne: query._id || this.getQuery()._id },
      });
      if (existingPhone) {
        const error = new Error('Phone number already exists');
        error.statusCode = 409;
        return next(error);
      }
    }
  } catch (err) {
    next(err);
  }

  return next();
});


module.exports = mongoose.model('User', userSchema);
