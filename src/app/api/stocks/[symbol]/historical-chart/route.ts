import { Redis } from "ioredis";
import { REDIS_TTL } from "@/constants/redis";
import { encodeKey } from "@/utils/encode";
import { lightFormat, subDays } from "date-fns";

const IDENTIFIER = "STOCK-HISTORICAL-CHART";
const TIMEFRAME = "1day";
const REPORT_DAYS = 30;

export async function GET(
  _: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;

  const today = new Date();
  const lastMonth = subDays(today, REPORT_DAYS);
  const todayStr = lightFormat(today, "yyyy-MM-dd");
  const lastMonthStr = lightFormat(lastMonth, "yyyy-MM-dd");

  const redisId = `${IDENTIFIER}-${TIMEFRAME}-${encodeKey(symbol)}-${encodeKey(
    `from-${todayStr}-to-${lastMonthStr}`
  )}`;

  try {
    const redis = new Redis({
      host: "localhost",
      port: 6379,
    });

    /* Use the existing data from Redis cache */
    const cachedStocks = await redis.get(redisId);
    if (cachedStocks && cachedStocks !== "{}") {
      return Response.json(JSON.parse(cachedStocks), { status: 200 });
    }

    /* Fetch data from external API */
    const apiData = await fetchStockDataFromExternalAPI(
      symbol,
      lastMonthStr,
      todayStr
    );

    if (apiData["Error Message"]) {
      return Response.json(
        {
          message: `\nFailed to fetch stock historical chart of [${symbol}] from external API:\n${apiData["Error Message"]}`,
        },
        { status: 500 }
      );
    }

    /* Store data in Redis cache */
    await redis.set(redisId, JSON.stringify(apiData), "EX", REDIS_TTL);

    return Response.json(apiData, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

const baseUrl = "https://financialmodelingprep.com/api/v3/";
const apikey = "117xIuRPUk8fVkTr2tUt9D4B1EVxsurZ";

async function fetchStockDataFromExternalAPI(
  symbol: string,
  from: string,
  to: string
) {
  try {
    const input = `historical-chart/${TIMEFRAME}/${symbol}`;
    const response = await fetch(
      `${baseUrl}${input}?apikey=${apikey}&from=${from}&to=${to}`,
      {
        cache: "no-store",
      }
    );
    return await response.json();
  } catch (error) {
    throw new Error();
  }
}
