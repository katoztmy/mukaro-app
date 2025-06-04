"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { getProfile, Profile, getUserStats } from "@/utils/database";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<{ total: number; liked: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 未ログイン時はログインページにリダイレクト
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      if (user) {
        try {
          const profileData = await getProfile(user.id);
          setProfile(profileData);

          const statsData = await getUserStats(user.id);
          setStats(statsData);
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 60px)",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              border: "2px solid #F97316",
              borderRadius: "50%",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
              marginBottom: "8px",
            }}
          />
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div
        style={{
          maxWidth: "448px",
          margin: "0 auto",
          padding: "24px 16px",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          プロフィール
        </h1>

        {profile && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                ユーザー名
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {profile.full_name || "未設定"}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                メールアドレス
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {profile.username}
              </p>
            </div>
          </div>
        )}

        {stats && (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
              padding: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              統計情報
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                総投稿数
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {stats.total}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                スッキリした投稿数
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {stats.liked}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
