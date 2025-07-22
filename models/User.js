const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      required: [true, 'Please enter email'],
    },

    name: {
      type: String,
      required: [true, 'Please enter name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    }
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
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
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

userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    const query = this.getQuery();

    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }
    if (update.email) {
      const existingEmail = await this.model.findOne({
        email: update.email,
        _id: { $ne: query._id },
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
        _id: { $ne: query._id },
      });
      if (existingPhone) {
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

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
