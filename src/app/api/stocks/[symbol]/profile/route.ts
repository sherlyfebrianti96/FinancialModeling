import { Redis } from "ioredis";
import { REDIS_TTL } from "@/constants/redis";
import { encodeKey } from "@/utils/encode";

const IDENTIFIER = "STOCK-PROFILE";

export async function GET(
  _: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  try {
    const redis = new Redis({
      host: "localhost",
      port: 6379,
    });

    /* Use the existing data from Redis cache */
    const cachedStocks = await redis.get(`${IDENTIFIER}-${encodeKey(symbol)}`);
    if (cachedStocks && cachedStocks !== "{}") {
      return Response.json(JSON.parse(cachedStocks), { status: 200 });
    }

    /* Fetch data from external API */
    const apiData = await fetchStockDataFromExternalAPI(symbol);

    if (apiData?.length > 0) {
      /* Store data in Redis cache */
      await redis.set(
        `${IDENTIFIER}-${encodeKey(symbol)}`,
        JSON.stringify(apiData[0]),
        "EX",
        REDIS_TTL
      );
    }

    return Response.json(apiData, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

const baseUrl = "https://financialmodelingprep.com/api/v3/";
const apikey = "BsDcA4xSo2NkGvbjLHid0nULWk8AaOHV";

async function fetchStockDataFromExternalAPI(symbol: string) {
  try {
    const input = `profile/${symbol}`;
    const response = await fetch(`${baseUrl}${input}?apikey=${apikey}`, {
      cache: "no-store",
    });
    return await response.json();
  } catch (error) {
    throw new Error(
      `Failed to fetch stock profile of [${symbol}] from external API`
    );
  }
}
