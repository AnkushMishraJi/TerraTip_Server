const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let dbURI;
    if (process.env.NODE_ENV === 'production') {
      dbURI = process.env.MONGO_URI_PROD;
    } else {
      dbURI = process.env.MONGO_URI_DEV;
    }
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected:', dbURI);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
