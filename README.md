# Bitcoin Guessing Game

[![Netlify Status](https://api.netlify.com/api/v1/badges/57ea68f1-f6d9-4a4d-bda7-8cdcd54afa50/deploy-status)](https://app.netlify.com/sites/btc-guessing-game/deploys)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Description

A web app where users guess if the BTC/USD price will go up or down after one minute.

## Technologies Used

- Next.js
- TypeScript
- TailwindCSS
- AWS (DynamoDB, Lambda)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure the `.env.local` file with the following credentials:
  ```
N_AWS_ACCESS_KEY_ID=
N_AWS_SECRET_ACCESS_KEY=
N_AWS_REGION=
  ```
*Note that these are custom environment variables to work with the Netlify Previews

4. Run the development server:

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
