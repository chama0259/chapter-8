//SWRで使う共通のfetcher
//第一引数はURL、第二引数は（あれば）Authorization Token
export const fetcher = async (args: string | [string, string | null]) => {
  // 引数が配列なら [url, token] に分解、文字列なら url だけ取り出す
  const [url, token] = Array.isArray(args) ? args : [args, null];
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
