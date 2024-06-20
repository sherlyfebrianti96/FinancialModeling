import { REDIS_TTL } from "@/constants/redis";
import Redis from "ioredis";

export async function GET() {
  try {
    const redis = new Redis({
      host: "localhost",
      port: 6379,
    });

    /* Use the existing data from Redis cache */
    const cachedStocks = await redis.get("stocks");
    if (cachedStocks && cachedStocks !== "{}") {
      return Response.json(JSON.parse(cachedStocks), { status: 200 });
    }

    /* Fetch data from external API */
    const apiData = await fetchStockDataFromExternalAPI();

    if (apiData["Error Message"]) {
      return Response.json(
        {
          message: `\nFailed to fetch Stocks from external API:\n${apiData["Error Message"]}`,
        },
        { status: 500 }
      );
    }

    /* Store data in Redis cache */
    await redis.set("stocks", JSON.stringify(apiData), "EX", REDIS_TTL);

    return Response.json(apiData, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

const baseUrl = "https://financialmodelingprep.com/api/v3/";
const apikey = "ForD4Xf0vgQ08zEtbdZaFnQI25hdjX1m";

async function fetchStockDataFromExternalAPI() {
  try {
    /**
     * Supposed to use this `stock/list` to show all Data and combining it with `profile/${symbol}`.
     * However, I used data from NASDAQ exchange only, because the free API Key is limited to US Stock only.
     */
    const input = `symbol/NASDAQ`;
    const response = await fetch(`${baseUrl}${input}?apikey=${apikey}`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    throw new Error("Failed to fetch stock data from external API");
  }
}
