const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const Property = require('../../../models/Property');
const landTrendService = require('../../../services/landTrend');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

eventEmitter.on('updatePropertyPrice', async (input, propertyId, userId) => {
  try {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 2000;
    let attempts = 0;
    let result = null;

    while (attempts < MAX_RETRIES) {
      result = await landTrendService.generateTrend(input);

      if (result?.jsonMatch?.[0]) break;

      attempts++;
      console.log(`Retrying generateTrend... attempt ${attempts}`);
      await delay(RETRY_DELAY_MS);
    }

    let priceTrendJsonString = result?.jsonMatch?.[0] || null;
    let priceTrend = null;
    let latestYear = null;
    let latestPrice = null;
    let explanation = '';

    if (priceTrendJsonString) {
      // Clean and parse
      priceTrendJsonString = priceTrendJsonString
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

      try {
        priceTrend = JSON.parse(priceTrendJsonString);
        const years = Object.keys(priceTrend).sort();
        latestYear = years[years.length - 1];
        latestPrice = priceTrend[latestYear];
      } catch (parseErr) {
        console.warn("⚠️ Failed to parse JSON:", parseErr.message);
        priceTrendJsonString = null;
      }

      const rawText = result?.jsonMatch?.input || '';
      const explanationMatch = rawText.match(/Explanation:\s*([\s\S]*)/i);
      explanation = explanationMatch ? explanationMatch[1].trim() : '';
    }

    const updateData = {
      priceFetchDate: new Date(),
      propertyPrice: latestPrice || null,
      propertyPriceYear: latestYear || null,
      priceTrend: priceTrendJsonString,
      explaination: explanation,
    };

    const updated = await Property.findOneAndUpdate(
      { userId, _id: propertyId },
      updateData,
      { new: true }
    );

    if (!updated) {
      console.warn("⚠️ Property not found for update");
    } else {
      console.log("✅ Property price update stored successfully");
    }

  } catch (err) {
    console.error("❌ Failed to update property price:", err);
  }
});

module.exports = eventEmitter