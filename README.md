# Algo Trade Hono

Algo Trade Hono is a service that acts as a webhook event processor for TradingView alerts using [Hono](https://hono.dev/) framework. It provides an endpoint for TradingView alerts to send messages as the body, which can be used to execute trades on a cryptocurrency exchange using APIs.

## Installation

To get started, follow these instructions:

1. Run npm install to install the necessary dependencies.

```bash
npm install
```

2. Run npm run dev to start the server locally on localhost:8787.

```bash
npm run dev
```

## Deployment

To deploy the app to cloudflare worker, use the following command:

```bash
npm run deploy
```

## Database Setup

To create the initial database, use the following command:

```bash
npm run migrate:init
```

To run the database migration, execute the following command:

```bash
npm run migrate:execute
```

## Endpoint

The endpoint for the webhook is `/v1/binance`. The request body should be in JSON string format. You can customize the endpoint and integrate with your preferred broker API (e.g., Binance, Coinbase, etc.). 

## Contribute
Feel free to customize the endpoint or add  broker according to your specific requirements.