const axios = require("axios");
const { retry } = require("./utils/retry");

class BitcoinPriceTracker {
  constructor(config) {
    if (!config || !config.webhookUrl) {
      throw new Error("Missing required configuration: webhookUrl is required");
    }

    this.apiUrl =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
    this.webhookUrl = config.webhookUrl;
    this.updateInterval = config.updateInterval || 60000; // Default: 1 minute
    this.lastPrice = null;
  }

  async fetchBitcoinPrice() {
    try {
      console.log("Fetching Bitcoin price...");
      const response = await retry(() => axios.get(this.apiUrl), {
        maxAttempts: 3,
        delay: 5000,
        shouldRetry: (error) =>
          error.code === "ECONNRESET" || error.code === "ETIMEDOUT",
      });

      const price = response.data.bitcoin.usd;
      console.log(`Bitcoin price fetched: $${price}`);
      return price;
    } catch (error) {
      console.error("Error fetching Bitcoin price:", error);
      return null;
    }
  }

  async sendToWebhook(price) {
    if (price === null) {
      console.error("No valid price to send");
      return;
    }

    if (this.lastPrice !== null && this.lastPrice === price) {
      console.log("Price unchanged, skipping webhook update.");
      return;
    }

    const message = `⚡ Bitcoin Price Update: $${price} USD`;
    const payload = {
      event_name: "bitcoin_price_update",
      message: message,
      status: "success",
      username: "bitcoin_tracker",
    };

    try {
      await retry(
        () =>
          axios.post(this.webhookUrl, payload, {
            headers: { "Content-Type": "application/json" },
          }),
        {
          maxAttempts: 3,
          delay: 10000,
          shouldRetry: (error) =>
            error.code === "ECONNRESET" || error.code === "ETIMEDOUT",
        }
      );

      console.log("Successfully sent price update to webhook:", message);
      this.lastPrice = price;
    } catch (error) {
      console.error("Error sending webhook update:", error);
    }
  }

  async startTracking() {
    console.log("Starting Bitcoin Price Tracker...");
    await this.trackAndSend();
    this.interval = setInterval(() => this.trackAndSend(), this.updateInterval);
  }

  async trackAndSend() {
    try {
      const price = await this.fetchBitcoinPrice();
      await this.sendToWebhook(price);
    } catch (error) {
      console.error("Error in tracking cycle:", error);
    }
  }

  stopTracking() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("Bitcoin Price Tracker stopped");
    }
  }
}

const config = {
  updateInterval: process.env.UPDATE_INTERVAL || 60000, // 1-minute updates
  webhookUrl:
    "https://ping.telex.im/v1/webhooks/019512a5-38fe-773c-b7b8-12b093e00887",
};

const bitcoinTracker = new BitcoinPriceTracker(config);
bitcoinTracker.startTracking();

module.exports = BitcoinPriceTracker;
