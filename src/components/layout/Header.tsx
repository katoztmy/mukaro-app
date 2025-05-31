"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

type HeaderProps = {
  showHistoryButton?: boolean;
};

export default function Header({ showHistoryButton = true }: HeaderProps) {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const goToHistory = () => {
    router.push("/history");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("ログアウト成功");
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
        <h1
          style={{
            marginLeft: "16px",
            fontSize: "20px",
            fontWeight: 700,
            color: "#F97316",
            lineHeight: "1.4em",
          }}
        >
          ムカログ
        </h1>
        <div style={{ flex: 1 }}></div>

        {user && (
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2C12.0002 2 12.0002 2 12.0002 2M12.0002 2C12.0002 2 12.0002 2 12.0002 12M12.0002 2L2 12"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                  />
                </svg>
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
      </div>
    </header>
  );
}
