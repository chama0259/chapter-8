//SWRで使う共通のfetcher
//第一引数はURL、第二引数は（あれば）Authorization Token
export const fetcher = async ([url, token]: [string, string | null]) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = token;
  }
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error("エラーが発生しました");
  }
  return res.json();
};
