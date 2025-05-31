"use client";

import { useEffect } from "react";

// LocalStorageをクリアするクライアントコンポーネント
export default function ClearLocalStorage() {
  useEffect(() => {
    // LocalStorageからムカログデータをクリア
    if (typeof window !== "undefined") {
      localStorage.removeItem("mukaro_posts");
      console.log("LocalStorageからムカログデータをクリアしました");
    }
  }, []);

  // 何もレンダリングしない
  return null;
}
