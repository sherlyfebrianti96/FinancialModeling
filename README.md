This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequisite

Before running the application, we need to prepare our local environment first.

#### NVM

You can either use the Node latest LTS or using NVM.

```
/* Install the npm version registered on this app */
nvm install

/* Use the npm version registered on this app */
nvm use
```

#### Redis

To optimize performance, this application is using Redis as a temporary cache, allowing it to effectively manage the constraints imposed by the external API, which limits access to 250 calls per day.

If you're on macOS, you can quickly set up Redis with these commands:

```
/* Install the Redis */
brew install redis

/* Start the Redis */
brew services start redis
```

For other operating systems, refer to the Redis installation guide available at https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/.

## Getting Started

First, install all dependencies:

```
npm install
```

Then, run the development server:

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

## Feature Preview : Stock Listing

For a detailed look at each feature, [view the screenshots here](./preview/README.md).

https://github.com/sherlyfebrianti96/FinancialModeling/assets/2855979/aa4c01f8-292f-4e55-ae50-fe371cc059af

<video width="100%" controls>
  <source src="./preview/assets/02. Speedup Footage.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<a href="./preview/assets/02. Speedup Footage.mp4" download="02. Speedup Footage.mp4">
  <button style="margin-top: 10px; padding: 10px 20px; font-size: 16px; cursor: pointer;">
    Download Video
  </button>
</a>

