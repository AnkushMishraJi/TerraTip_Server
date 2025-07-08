module.exports = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong',
  });
};
