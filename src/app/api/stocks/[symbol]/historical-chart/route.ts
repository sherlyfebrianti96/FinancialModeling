import { encodeKey } from "@/utils/encode";
import { lightFormat, subDays } from "date-fns";
import getExternalData from "@/utils/getExternalData";

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

  return await getExternalData({
    identifier: redisId,
    apiPath: `historical-chart/${TIMEFRAME}/${symbol}`,
    apiParams: { from: lastMonthStr, to: todayStr },
    failureMessage: (originalMessage: string) =>
      `\nFailed to fetch stock historical chart of [${symbol}] from external API:\n${originalMessage}`,
  });
}
