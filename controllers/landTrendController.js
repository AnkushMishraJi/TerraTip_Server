const { reverseGeocode } = require('../utils/geocode');
const landTrendService = require('../services/landTrendService'); 
const catchAsync = require('../utils/catchAsync');

exports.getTrend = catchAsync(async (req, res) => {
  const input = req.body;
  // console.log("📦 Incoming Request Body:", input);
//   if (!input.latitude || !input.longitude || !input.size_sqft || !input.area_type) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Missing required fields',
//     });
//   }
  // console.log("🧪 typeof latitude:", typeof input.latitude);
  // console.log("🧪 typeof longitude:", typeof input.longitude);
  // console.log("🧪 typeof size_sqft:", typeof input.size_sqft);
  // console.log("🧪 typeof area_type:", typeof input.area_type);
//   if (
//   typeof input.latitude === 'undefined' ||
//   typeof input.longitude === 'undefined' ||
//   typeof input.size_sqft === 'undefined' ||
//   typeof input.area_type === 'undefined'
//     ) {
//     return res.status(400).json({
//         status: 'error',
//         message: 'Missing required fields: latitude, longitude, size_sqft, area_type',
//     });
// }

  // if (!input.location) {
  //   input.location = await reverseGeocode(input.latitude, input.longitude);
  // }

  const data = await landTrendService.generateTrend(input);   

  res.status(200).json({
    status: 'success',
    location: data.input.location,
    trend: JSON.parse(data?.jsonMatch[0]),
  });
});

exports.getTrendByLocation = catchAsync(async (req, res) => {
  const input = req.body;

  // if (!latitude || !longitude) {
  //   return res.status(400).json({
  //     status: 'error',
  //     message: 'latitude and longitude are required',
  //   });
  // }

  // const location = await reverseGeocode(latitude, longitude);
  input.area_type = "Urban";
  input.size_sqft = 1000;
  const data = await landTrendService.generateTrend(input
  //   {
  //   latitude,
  //   longitude,
  //   location,
  //   area_type: 'Urban',     // default fallback
  //   size_sqft: 1000         // default fallback
  // }
);

  res.status(200).json({
    status: 'success',
    location: data.input.location,
    trend: JSON.parse(data?.jsonMatch[0]),
  });
});
