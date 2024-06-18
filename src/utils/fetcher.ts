"use client";

const baseUrl = "https://financialmodelingprep.com/api/v3/";
const apikey = "l9BzWSMFaAuyks4QZsB4dFrCFdQuNDOF";

export default async function fetcher(
  input: string,
  method: string = "GET",
  init?: RequestInit
) {
  if (input.startsWith("/")) {
    input.slice(1);
  }
  if (input.endsWith("/")) {
    input.slice(0, -1);
  }

  const response = await fetch(`${baseUrl}${input}?apikey=${apikey}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (response.ok) {
    return response.json();
  }

  return response;
}
