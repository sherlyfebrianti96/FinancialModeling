import { API_BASE_URL } from "@/constants/network";
import { REDIS_TTL } from "@/constants/redis";
import { Redis } from "ioredis";

const API_KEY = "ForD4Xf0vgQ08zEtbdZaFnQI25hdjX1m";

interface externalDataParams {
  identifier: string;
  apiPath: string;
  apiParams?: Record<string, string>;
  failureMessage: (originalMessage: string) => string;
}

const getExternalData = async ({
  identifier,
  apiPath,
  apiParams,
  failureMessage,
}: externalDataParams) => {
  try {
    const redis = new Redis({
      host: "localhost",
      port: 6379,
    });

    /* Use the existing data from Redis cache */
    const cachedStocks = await redis.get(identifier);
    if (cachedStocks && cachedStocks !== "{}") {
      return Response.json(JSON.parse(cachedStocks), { status: 200 });
    }

    /* Fetch data from external API */
    const apiData = await fetchDataFromExternalAPI(apiPath, apiParams);

    console.log("debug apiData : ", apiData);

    if (apiData["Error Message"]) {
      return Response.json(
        {
          message: failureMessage(apiData["Error Message"]),
        },
        { status: 500 }
      );
    }

    /* Store data in Redis cache */
    await redis.set(identifier, JSON.stringify(apiData), "EX", REDIS_TTL);

    return Response.json(apiData, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export default getExternalData;

async function fetchDataFromExternalAPI(
  input: string,
  params?: Record<string, string>
) {
  if (input.startsWith("/")) {
    input = input.slice(1);
  }
  if (input.endsWith("/")) {
    input = input.slice(0, -1);
  }
  const paramsObj = { apikey: API_KEY, ...params };
  const searchParams = new URLSearchParams(paramsObj);

  console.log(
    "debug `${API_BASE_URL}${input}?${searchParams.toString()}` : ",
    `${API_BASE_URL}${input}?${searchParams.toString()}`
  );

  try {
    /**
     * Supposed to use this `stock/list` to show all Data and combining it with `profile/${symbol}`.
     * However, I used data from NASDAQ exchange only, because the free API Key is limited to US Stock only.
     */
    const response = await fetch(
      `${API_BASE_URL}${input}?${searchParams.toString()}`,
      {
        cache: "no-store",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching data from external API:", error);
    throw new Error("Failed to fetch stock data from external API");
  }
}
