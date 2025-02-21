const integrationSpecs = {
  data: {
    date: {
      created_at: "2025-02-18",
      updated_at: "2025-02-18",
    },
    descriptions: {
      app_name: "Bitcoin Price Tracker",
      app_description:
        "Interval integration that fetches the latest Bitcoin price from CoinGecko every 30 minutes and posts updates to a Telex channel.",
      app_url: "https://telex-integration-btc-price.onrender.com/",
      app_logo:
        "https://media-hosting.imagekit.io//ab2a91db26c14a95/telex-btc-logo.jpg",
      background_color: "#f7931a",
    },
    integration_category: "Finance & Crypto",
    integration_type: "interval",
    is_active: true,
    output: [
      {
        label: "output_channel_1",
        value: true,
      },
    ],
    key_features: [
      "Fetches real-time Bitcoin price from CoinGecko.",
      "Posts formatted updates to a Telex channel via webhook.",
      "Executes on a fixed interval using crontab syntax.",
      "Provides real-time market updates.",
    ],
    permissions: {
      monitoring_user: {
        always_online: true,
        display_name: "BTC Price Monitor",
      },
    },
    settings: [
      {
        label: "interval",
        type: "text",
        required: true,
        default: "*/30 * * * *",
        description: "Cron expression defining how often the integration runs.",
      },
      {
        label: "webhookURL",
        type: "text",
        required: true,
        default:
          "https://ping.telex.im/v1/webhooks/019513df-f990-7957-a978-b7601584d872",
        description: "URL to which webhook payloads are sent.",
      },
      {
        label: "apiURL",
        type: "text",
        required: true,
        default:
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        description: "CoinGecko API endpoint for fetching Bitcoin price.",
      },
      {
        label: "eventName",
        type: "text",
        required: true,
        default: "btc_price_update",
        description: "Event name to be sent in the webhook payload.",
      },
      {
        label: "status",
        type: "text",
        required: true,
        default: "success",
        description: "Status indicator sent in the webhook payload.",
      },
      {
        label: "username",
        type: "text",
        required: true,
        default: "bitcoin_tracker",
        description: "Username to be included in the webhook payload.",
      },
    ],
    target_url: "",
    tick_url: "https://telex-integration-btc-price.onrender.com/tick",
  },
};

module.exports = integrationSpecs;
