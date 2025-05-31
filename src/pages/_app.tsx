import { AppProps } from "next/app";
import { useEffect } from "react";
import "../utils/clearStorage"; // LocalStorageクリア用

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // アプリ起動時の処理（必要に応じて追加）
    console.log("ムカログアプリを起動しました");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
