const axios = require('axios');

exports.reverseGeocode = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  const res = await axios.get(url, {
    headers: { 'User-Agent': 'land-price-estimator-app' }
  });

  return res.data.display_name || `${lat},${lon}`;
};
