const express = require("express");
const cors = require("cors");
const BitcoinPriceTracker = require("./api");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure the Bitcoin Price Tracker
const bitcoinTracker = new BitcoinPriceTracker({
  webhookUrl:
    process.env.WEBHOOK_URL ||
    "https://ping.telex.im/v1/webhooks/019512a5-38fe-773c-b7b8-12b093e00887",
  updateInterval: process.env.UPDATE_INTERVAL || 60000, // Default to 1-minute updates
});

// Start tracking Bitcoin prices
bitcoinTracker.startTracking();

// Endpoint to manually trigger price fetching and webhook update
app.post("/tick", async (req, res) => {
  try {
    await bitcoinTracker.trackAndSend();
    res.json({
      status: "success",
      message: "Bitcoin price fetched and sent successfully",
    });
  } catch (error) {
    console.error("Error in /tick:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch and send Bitcoin price",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
