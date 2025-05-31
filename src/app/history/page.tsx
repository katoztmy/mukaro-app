"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { getPosts, getLikedPostsCount, type Post } from "@/utils/posts";

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
                          backgroundColor:
                            post.style === "ogiri" ? "#FFF7ED" : "#FDF2F8",
                          border: `1px solid ${
                            post.style === "ogiri" ? "#FED7AA" : "#FBCFE8"
                          }`,
                          borderRadius: "9999px",
                          padding: "4px 11px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color:
                              post.style === "ogiri" ? "#EA580C" : "#DB2777",
                            lineHeight: "1.33em",
                          }}
                        >
                          {post.style === "ogiri" ? "大喜利" : "川柳"}
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
                        marginBottom: "8px",
                      }}
                    >
                      {post.result}
                    </p>
                    {/* リアクション表示は別途実装できますが、今回は省略 */}
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
