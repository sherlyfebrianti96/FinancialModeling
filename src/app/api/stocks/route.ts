import getExternalData from "@/utils/getExternalData";

const IDENTIFIER = "STOCKS";

export async function GET() {
  return await getExternalData({
    identifier: IDENTIFIER,
    apiPath: `symbol/NASDAQ`,
    failureMessage: (originalMessage: string) =>
      `\nFailed to fetch Stocks from external API:\n${originalMessage}`,
  });
}
