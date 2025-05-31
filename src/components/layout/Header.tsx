"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  showHistoryButton?: boolean;
};

export default function Header({ showHistoryButton = true }: HeaderProps) {
  const router = useRouter();
  const { signOut, user, session, refreshSession } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // マウント時にセッション状態を確認
  useEffect(() => {
    const checkAuth = async () => {
      await refreshSession();
      setIsAuthenticated(!!user && !!session);
    };

    checkAuth();
  }, [user, session, refreshSession]);

  const goToHistory = () => {
    router.push("/history");
  };

  const handleLogout = async () => {
    try {
      // クッキーとセッションストレージをクリア
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_redirect_completed");
      }

      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <header
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E5E5",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "448px",
          height: "60px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            marginLeft: "16px",
            cursor: "pointer",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#F97316",
              lineHeight: "1.4em",
            }}
          >
            ムカログ
          </h1>
        </Link>
        <div style={{ flex: 1 }}></div>

        {isAuthenticated && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginRight: "16px",
            }}
          >
            {showHistoryButton && (
              <button
                onClick={goToHistory}
                style={{
                  width: "32px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                aria-label="履歴"
                title="履歴"
              >
                <Image
                  src="/icons/history-clock-icon.svg"
                  alt="履歴"
                  width={20}
                  height={20}
                />
              </button>
            )}

            <button
              onClick={handleLogout}
              style={{
                width: "32px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="ログアウト"
              title="ログアウト"
            >
              <Image
                src="/icons/logout-icon.svg"
                alt="ログアウト"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div style={{ marginRight: "16px" }}>
            <button
              onClick={() => router.push("/login")}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "none",
                background: "linear-gradient(to right, #FB923C, #EC4899)",
                color: "white",
                cursor: "pointer",
              }}
            >
              ログイン
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
