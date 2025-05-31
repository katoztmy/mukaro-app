/**
 * ムカログアプリのLocalStorageデータをクリアする関数
 */
export const clearMukaroStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mukaro_posts");
    console.log("LocalStorageからムカログデータをクリアしました");
  }
};

// 自動実行（このファイルがインポートされた時点でクリア実行）
if (typeof window !== "undefined") {
  clearMukaroStorage();
}
