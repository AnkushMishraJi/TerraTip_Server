exports.buildLandTrendPrompt = (input) => {
  return `
You are a real estate price analysis expert.

Estimate the total price for the provided size of land plot from 2020 to 2025  in the given location and land context:

- 📍 Location: ${input.location || 'Unknown'}
- 🧭 Coordinates: Latitude ${input.latitude}, Longitude ${input.longitude}
- 📐 Size: ${input.size_sqft} sqft
- 🏕️ Area Type: ${input.area_type}
- 🏷️ Land Type: ${input.land_type}
- 🧾 Ownership: ${input.ownership}
- 🚧 Road Access: ${input.road_access}
- 🏘️ Zone Classification: ${input.zone_classification}
- 🛒 Market Distance: ${input.market_distance_km} km
- 🔌 Utilities Available: ${input.utilities}
- 🗺️ Topography: ${input.topography}

Respond in JSON format only:
{
  "2020": 1500,
  "2021": 1650,
  "2022": 1800,
  "2023": 1950,
  "2024": 2100
}
`;
};
