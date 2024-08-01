# Bitcoin Guessing Game

[![Netlify Status](https://api.netlify.com/api/v1/badges/57ea68f1-f6d9-4a4d-bda7-8cdcd54afa50/deploy-status)](https://app.netlify.com/sites/btc-guessing-game/deploys)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

A web app where users guess if the BTC/USD price will go up or down after one minute.

<img width="1552" alt="Screenshot 2024-07-31 at 18 38 02" src="https://github.com/user-attachments/assets/4b49bc0e-1304-4b80-9b8a-48b5158dd6c2">

## Features

This repository includes the following features:

1. Real-time BTC/USD price updates: The app fetches the latest BTC/USD price from an API and displays it to the users.

2. Guessing game: Users can make predictions on whether the BTC/USD price will go up or down after one minute.

3. Persistence: The app stores user data, including scores and game history, using AWS DynamoDB.

4. Responsive design: The app is built with TailwindCSS and is optimized for different screen sizes.

5. Clear information: Users can verify if the price when up, down or if it stayed the same, as well as for how much.

6. Testing: Both the UI and the api functionality are covered with tests.


## Technologies Used

- Next.js
- TypeScript
- TailwindCSS
- AWS (DynamoDB, Lambda)
- Vitest

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create an account in [CoinMarketCap](https://pro.coinmarketcap.com/signup/?plan=0) to get an API key.

4. Create your AWS acount and a DynamoDB Table named 'BTC-guessing-game-scores'. Get your credentials by creating a new [IAM role](https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html).

5. Configure the `.env.local` file with the following credentials:
  ```
N_AWS_ACCESS_KEY_ID=
N_AWS_SECRET_ACCESS_KEY=
N_AWS_REGION=
N_COIN_MARKET_API=
  ```
*Note that these are custom environment variables to work with the Netlify Previews

6. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Test

Run test by running:
```bash
npm test
```
