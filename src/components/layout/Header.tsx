"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/utils/database";
import GuideMode from "../GuideMode";

type HeaderProps = {
  showHistoryButton?: boolean;
  seasonTheme?: 'spring' | 'summer' | 'autumn' | 'winter' | null;
};

export default function Header({ showHistoryButton = true, seasonTheme = null }: HeaderProps) {
  const router = useRouter();
  const { signOut, user, session, refreshSession } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isGuideModeOpen, setIsGuideModeOpen] = useState(false);

  // マウント時にセッション状態を確認
  useEffect(() => {
    const checkAuth = async () => {
      await refreshSession();
      setIsAuthenticated(!!user && !!session);

      if (user) {
        const profile = await getProfile(user.id);
        if (profile && profile.full_name) {
          setUserName(profile.full_name);
        }
      }
    };

    checkAuth();
  }, [user, session, refreshSession]);

  const goToHistory = () => {
    router.push("/history");
  };

  const goToCollection = () => {
    router.push("/collection");
  };

  const goToCalendar = () => {
    router.push("/calendar");
  };


  const goToUserProfile = () => {
    router.push("/profile");
  };

  const openGuideMode = () => {
    setIsGuideModeOpen(true);
  };

  const closeGuideMode = () => {
    setIsGuideModeOpen(false);
  };

  const handleLogout = async () => {
    try {
      // ログアウト専用ページにリダイレクト
      window.location.href = "/logout";
    } catch (error) {
      console.error("ログアウトエラー:", error);
      // エラーが発生しても強制的にリダイレクト
      window.location.href = "/logout";
    }
  };

  // 季節テーマに応じたヘッダースタイルを取得
  const getSeasonalHeaderStyle = () => {
    if (!seasonTheme) {
      return {
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E5E5",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      };
    }

    switch (seasonTheme) {
      case 'spring':
        return {
          backgroundColor: "rgba(254, 243, 199, 0.9)",
          borderBottom: "1px solid rgba(251, 191, 36, 0.3)",
          boxShadow: "0px 1px 2px 0px rgba(249, 115, 22, 0.1)",
          backdropFilter: "blur(10px)",
        };
      case 'summer':
        return {
          backgroundColor: "rgba(219, 234, 254, 0.9)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0px 1px 2px 0px rgba(59, 130, 246, 0.1)",
          backdropFilter: "blur(10px)",
        };
      case 'autumn':
        return {
          backgroundColor: "rgba(254, 215, 170, 0.9)",
          borderBottom: "1px solid rgba(251, 146, 60, 0.3)",
          boxShadow: "0px 1px 2px 0px rgba(251, 146, 60, 0.1)",
          backdropFilter: "blur(10px)",
        };
      case 'winter':
        return {
          backgroundColor: "rgba(229, 231, 235, 0.9)",
          borderBottom: "1px solid rgba(156, 163, 175, 0.3)",
          boxShadow: "0px 1px 2px 0px rgba(107, 114, 128, 0.1)",
          backdropFilter: "blur(10px)",
        };
      default:
        return {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E5E5",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        };
    }
  };

  return (
    <header
      style={getSeasonalHeaderStyle()}
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
            {userName && (
              <button
                onClick={goToUserProfile}
                style={{
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "0 8px",
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
                aria-label="プロフィール"
                title="プロフィール"
              >
                {userName}
              </button>
            )}

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
              onClick={goToCollection}
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
              aria-label="称号コレクション"
              title="称号コレクション"
            >
              <Image
                src="/icons/collection-icon.svg"
                alt="コレクション"
                width={20}
                height={20}
              />
            </button>

            <button
              onClick={goToCalendar}
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
              aria-label="ムカつきカレンダー"
              title="ムカつきカレンダー"
            >
              <div
                style={{
                  fontSize: "18px",
                  color: "#6B7280",
                }}
              >
                📅
              </div>
            </button>

            <button
              onClick={openGuideMode}
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
              aria-label="アンガーマネジメント・ガイド"
              title="アンガーマネジメント・ガイド"
            >
              <div
                style={{
                  fontSize: "18px",
                  color: "#3B82F6",
                }}
              >
                🧘
              </div>
            </button>

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

      {/* ガイドモードモーダル */}
      <GuideMode 
        isOpen={isGuideModeOpen} 
        onClose={closeGuideMode}
        postId={null}
        mukaText={null}
      />
    </header>
  );
}
