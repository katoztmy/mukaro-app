"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    async function performLogout() {
      try {
        // Supabaseのログアウト処理を実行
        await signOut();

        // ブラウザのストレージをクリア
        if (typeof window !== "undefined") {
          // セッションストレージをクリア
          sessionStorage.clear();
          // ローカルストレージをクリア
          localStorage.clear();

          // クッキーをクリア
          document.cookie.split(";").forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/"
              );
          });
        }

        // 最終手段として強制的にページをリロード
        window.location.href = "/login";
      } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
        // エラーが発生した場合も強制的にリダイレクト
        window.location.href = "/login";
      }
    }

    performLogout();
  }, [signOut]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p>ログアウト中...</p>
      </div>
    </div>
  );
}
