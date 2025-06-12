"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import {
  getPosts,
  getLikedPostsCount,
  type Post,
  ConvertStyle,
} from "@/utils/posts";

// スタイルの表示名マッピング
const styleDisplayNames: Record<ConvertStyle, string> = {
  ogiri: "大喜利",
  senryu: "川柳",
  manabi: "学び",
  total_affirmation: "全肯定",
  hissatsu_waza: "必殺技",
  news_bulletin: "ニュース速報",
  ijin: "偉人",
  chuunibyou: "厨二病",
  high_consciousness: "意識高い系",
  epic_tale: "壮大な物語",
};

// スタイルごとの色の設定
const styleColors: Record<
  ConvertStyle,
  { bg: string; border: string; text: string }
> = {
  ogiri: { bg: "#FFF7ED", border: "#FED7AA", text: "#EA580C" },
  senryu: { bg: "#FDF2F8", border: "#FBCFE8", text: "#DB2777" },
  manabi: { bg: "#ECFDF5", border: "#A7F3D0", text: "#059669" },
  total_affirmation: { bg: "#F0F9FF", border: "#BAE6FD", text: "#0284C7" },
  hissatsu_waza: { bg: "#EFF6FF", border: "#BFDBFE", text: "#3B82F6" },
  news_bulletin: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626" },
  ijin: { bg: "#F5F3FF", border: "#DDD6FE", text: "#7C3AED" },
  chuunibyou: { bg: "#F8FAFC", border: "#CBD5E1", text: "#475569" },
  high_consciousness: { bg: "#FEF9C3", border: "#FDE047", text: "#CA8A04" },
  epic_tale: { bg: "#FAF5FF", border: "#E9D5FF", text: "#9333EA" },
};

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 投稿を日付ごとにグループ化する関数
const groupPostsByDate = (posts: Post[]) => {
  const grouped: { [key: string]: Post[] } = {};

  posts.forEach((post) => {
    const dateKey = formatDate(post.created_at);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(post);
  });

  return Object.entries(grouped);
};

// スタイル名を取得する関数
const getStyleName = (style: ConvertStyle): string => {
  return styleDisplayNames[style] || style;
};

// スタイルの色情報を取得する関数
const getStyleColor = (
  style: ConvertStyle
): { bg: string; border: string; text: string } => {
  return styleColors[style] || styleColors.ogiri; // デフォルトは大喜利の色
};

export default function HistoryPage() {
  const router = useRouter();
  const [groupedPosts, setGroupedPosts] = useState<[string, Post[]][]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [likedPosts, setLikedPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 実際のデータをSupabaseから取得
    const fetchData = async () => {
      setLoading(true);
      try {
        const [posts, likedCount] = await Promise.all([
          getPosts(),
          getLikedPostsCount(),
        ]);

        const grouped = groupPostsByDate(posts);
        setGroupedPosts(grouped);
        setTotalPosts(posts.length);
        setLikedPosts(likedCount);
      } catch (error) {
        console.error("投稿の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Header showHistoryButton={false} />

      {/* メインコンテンツ */}
      <main style={{ maxWidth: "448px", margin: "0 auto" }}>
        {/* 統計情報 */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "17px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center", width: "33%" }}>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0A0A0A",
                  lineHeight: "1.33em",
                }}
              >
                {totalPosts}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.33em",
                }}
              >
                総投稿数
              </p>
            </div>
            <div style={{ textAlign: "center", width: "33%" }}>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#22C55E",
                  lineHeight: "1.33em",
                }}
              >
                {likedPosts}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.33em",
                }}
              >
                スッキリ
              </p>
            </div>
            <div style={{ textAlign: "center", width: "33%" }}>
              <p
                style={{
                  fontSize: "22.69px",
                  fontWeight: 700,
                  color: "#EAB308",
                  lineHeight: "1.41em",
                }}
              >
                {totalPosts > 0
                  ? Math.round((likedPosts / totalPosts) * 100)
                  : 0}
                %
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  lineHeight: "1.33em",
                }}
              >
                満足度
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          // ローディング表示
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #F97316",
                borderRadius: "50%",
                borderTopColor: "transparent",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        ) : groupedPosts.length > 0 ? (
          <>
            {groupedPosts.map(([date, posts], index) => (
              <div key={date} style={{ marginTop: "26px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src="/icons/calendar-3.svg"
                    alt="カレンダー"
                    width={16}
                    height={16}
                    style={{ marginRight: "8px" }}
                  />
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#374151",
                      lineHeight: "1.43em",
                    }}
                  >
                    {date}
                  </h2>
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#E5E7EB",
                      flex: 1,
                      marginLeft: "8px",
                    }}
                  />
                </div>

                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      marginTop: "12px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E5E5",
                      borderRadius: "8px",
                      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                      padding: "17px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      router.push(
                        `/result?id=${post.id}&input=${encodeURIComponent(
                          post.content
                        )}&style=${post.style}&result=${encodeURIComponent(
                          post.result
                        )}${
                          post.category_id
                            ? `&category_id=${post.category_id}`
                            : ""
                        }`
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-block",
                          backgroundColor: getStyleColor(
                            post.style as ConvertStyle
                          ).bg,
                          border: `1px solid ${
                            getStyleColor(post.style as ConvertStyle).border
                          }`,
                          borderRadius: "9999px",
                          padding: "4px 11px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: getStyleColor(post.style as ConvertStyle)
                              .text,
                            lineHeight: "1.33em",
                          }}
                        >
                          {getStyleName(post.style as ConvertStyle)}
                        </span>
                      </div>
                      {/* カテゴリ表示（あれば） */}
                      {post.categories && (
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor: post.categories.color || "#F3F4F6",
                            border: "1px solid #E5E7EB",
                            borderRadius: "9999px",
                            padding: "4px 11px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#374151",
                              lineHeight: "1.33em",
                            }}
                          >
                            {post.categories.name}
                          </span>
                        </div>
                      )}
                      <div style={{ marginLeft: "auto" }}>
                        <span
                          style={{
                            fontSize: "11.44px",
                            fontWeight: 400,
                            color: "#6B7280",
                            lineHeight: "1.4em",
                          }}
                        >
                          {new Date(post.created_at).getHours()}:
                          {String(
                            new Date(post.created_at).getMinutes()
                          ).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#4B5563",
                          lineHeight: "1.33em",
                        }}
                      >
                        {post.content}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#111827",
                        lineHeight: "1.43em",
                        marginBottom: "12px",
                      }}
                    >
                      {post.result}
                    </p>
                    
                    {/* リアクション表示 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flex: 1 }} />
                      
                      {post.reaction ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor: post.reaction === "like" ? "#F0FDF4" : "#FEF2F2",
                            border: `1px solid ${post.reaction === "like" ? "#BBF7D0" : "#FECACA"}`,
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>
                            {post.reaction === "like" ? "👍" : "👎"}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              color: post.reaction === "like" ? "#059669" : "#DC2626",
                            }}
                          >
                            {post.reaction === "like" ? "スッキリ！" : "うーん..."}
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            backgroundColor: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>❓</span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              color: "#6B7280",
                            }}
                          >
                            未評価
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "60px",
              paddingBottom: "40px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#F3F4F6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Image
                src="/icons/calendar-3.svg"
                alt="履歴"
                width={32}
                height={32}
              />
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#374151",
                lineHeight: "1.5em",
                marginBottom: "8px",
              }}
            >
              履歴はまだありません
            </p>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
                lineHeight: "1.43em",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              ムカつきを投稿すると、ここに履歴が表示されます
            </p>
            <Link
              href="/"
              style={{
                padding: "10px 16px",
                background: "linear-gradient(to right, #FB923C, #EC4899)",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#FAFAFA",
                lineHeight: "1.43em",
                textDecoration: "none",
              }}
            >
              投稿してみる
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
