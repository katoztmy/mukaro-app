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
        console.log("ログアウト処理を開始します");
        
        // Supabaseのログアウト処理を実行
        await signOut();
        console.log("Supabaseログアウト完了");

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

        console.log("ストレージクリア完了");

        // 少し待ってからリダイレクト
        setTimeout(() => {
          console.log("ログインページにリダイレクトします");
          window.location.href = "/login";
        }, 1000);
      } catch (error) {
        console.error("ログアウト中にエラーが発生しました:", error);
        // エラーが発生した場合も少し待ってからリダイレクト
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
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
