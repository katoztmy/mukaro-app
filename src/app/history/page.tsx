"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";

// 仮のデータ型定義
type Post = {
  id: string;
  content: string;
  result: string;
  style: "ogiri" | "senryu";
  category?: string;
  reaction: "like" | "dislike" | null;
  createdAt: string;
};

// 仮のデータ
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    content: "電車で隣に座った人が、ずっとスマホで動画を大音量で見ている",
    result: "電車内で 音漏れ垂れ流す 無神経",
    style: "senryu",
    category: "交通・通勤",
    reaction: "like",
    createdAt: "2023-12-01T15:30:00.000Z",
  },
  {
    id: "2",
    content: "コンビニのレジで小銭を数えるのに時間かかってる人がいて待たされた",
    result: "急いでるのに、あなたの小銭タイムショー、素晴らしいね！",
    style: "ogiri",
    category: "買い物・消費",
    reaction: "dislike",
    createdAt: "2023-12-01T10:15:00.000Z",
  },
  {
    id: "3",
    content: "会議で的外れな質問ばかりする人がいて時間が無駄になった",
    result: "会議室 質問という名の 時間泥棒",
    style: "senryu",
    category: "人間関係・職場",
    reaction: "like",
    createdAt: "2023-11-30T14:20:00.000Z",
  },
];

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 投稿を日付ごとにグループ化する関数
const groupPostsByDate = (posts: Post[]) => {
  const grouped: { [key: string]: Post[] } = {};

  posts.forEach((post) => {
    const dateKey = formatDate(post.createdAt);
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

  useEffect(() => {
    // 実際のアプリではAPIから履歴データを取得
    // ここではモックデータを使用
    const grouped = groupPostsByDate(MOCK_POSTS);
    setGroupedPosts(grouped);
    setTotalPosts(MOCK_POSTS.length);
    setLikedPosts(MOCK_POSTS.filter((post) => post.reaction === "like").length);
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

        {groupedPosts.length > 0 ? (
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
                    onClick={() => router.push(`/result?id=${post.id}`)}
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
                      {post.category && (
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor:
                              post.category === "交通・通勤"
                                ? "#EFF6FF"
                                : post.category === "買い物・消費"
                                ? "#FFF7ED"
                                : "#FAF5FF",
                            border: `1px solid ${
                              post.category === "交通・通勤"
                                ? "#BFDBFE"
                                : post.category === "買い物・消費"
                                ? "#FED7AA"
                                : "#E9D5FF"
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
                                post.category === "交通・通勤"
                                  ? "#2563EB"
                                  : post.category === "買い物・消費"
                                  ? "#EA580C"
                                  : "#9333EA",
                              lineHeight: "1.33em",
                            }}
                          >
                            {post.category}
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
                          {new Date(post.createdAt).getHours()}:
                          {String(
                            new Date(post.createdAt).getMinutes()
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Image
                        src={`/icons/${
                          post.reaction === "like"
                            ? "thumbs-up-history"
                            : "thumbs-down-history"
                        }.svg`}
                        alt={post.reaction === "like" ? "スッキリ" : "うーん"}
                        width={16}
                        height={16}
                        style={{ marginRight: "4px" }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 400,
                          color:
                            post.reaction === "like" ? "#22C55E" : "#EC4899",
                          lineHeight: "1.33em",
                        }}
                      >
                        {post.reaction === "like" ? "スッキリ" : "うーん"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* さらに読み込むボタン */}
            <button
              style={{
                width: "100%",
                height: "40px",
                marginTop: "32px",
                marginBottom: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  lineHeight: "1.43em",
                }}
              >
                さらに読み込む
              </span>
            </button>
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
