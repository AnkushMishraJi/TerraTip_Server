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

// Pre-save hook for duplicate email/phone
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('email') && this.email) {
      const existingEmail = await this.constructor.findOne({ email: this.email });
      if (existingEmail && existingEmail._id.toString() !== this._id.toString()) {
        return next(new Error('Email already exists'));
      }
    }

    if (this.isModified('phone')) {
      const existingPhone = await this.constructor.findOne({ phone: this.phone });
      if (existingPhone && existingPhone._id.toString() !== this._id.toString()) {
        return next(new Error('Phone number already exists'));
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Pre-update hook for duplicate check
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    const query = this.getQuery();

    if (update.email) {
      const existingEmail = await this.model.findOne({
        email: update.email,
        _id: { $ne: query._id || this.getQuery()._id },
      });
      if (existingEmail) {
        return next(new Error('Email already exists'));
      }
    }

    if (update.phone) {
      const existingPhone = await this.model.findOne({
        phone: update.phone,
        _id: { $ne: query._id || this.getQuery()._id },
      });
      if (existingPhone) {
        return next(new Error('Phone number already exists'));
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
