// module.exports = (err, req, res, next) => {
//   console.error("❌ Error:", err.message);

//   res.status(500).json({
//     status: 'error',
//     message: err.message || 'Something went wrong',
//   });
// };


const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // Terminal log
  console.error('❌ Error:', err.message);
  if (NODE_ENV == 'development') {
    console.error(err.stack);
  }

  if (err.name == 'ValidationError') {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.code && err.code == 11000) { // MongoDB duplicate key
    err.statusCode = 409;
    err.message = 'Duplicate field value entered';
  }


  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong',
    ...(NODE_ENV == 'development' && { stack: err.stack }),
  });
};

