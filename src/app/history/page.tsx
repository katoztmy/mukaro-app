"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 仮のデータ型定義
type Post = {
  id: string;
  content: string;
  result: string;
  style: "ogiri" | "senryu";
  reaction: "good" | "bad" | null;
  createdAt: string;
};

// 仮のデータ
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    content: "電車で隣に座った人が、ずっとスマホで動画を大音量で見ている",
    result: "公共の場でもスマホ動画を大音量、その配慮のなさ流石にハイレベル",
    style: "ogiri",
    reaction: "good",
    createdAt: "2023-05-31T10:30:00.000Z",
  },
  {
    id: "2",
    content:
      "会議中に同僚が自分の意見を全く別の言い方で繰り返して、あたかも自分のアイデアのように話していた",
    result: "パクられた 私のアイデア 君の手柄",
    style: "senryu",
    reaction: "good",
    createdAt: "2023-05-31T09:15:00.000Z",
  },
  {
    id: "3",
    content: "今日も朝から雨で、傘を持ってきたのに駅に着いたら晴れていた",
    result: "天気予報、まるで上司の気分のように当てにならない",
    style: "ogiri",
    reaction: "bad",
    createdAt: "2023-05-30T14:20:00.000Z",
  },
  {
    id: "4",
    content:
      "スーパーでレジに並んでいたら、急に新しいレジが開いて、後ろの人たちが先に行ってしまった",
    result: "並ぶ列 新しいレジに 置いてけぼり",
    style: "senryu",
    reaction: "good",
    createdAt: "2023-05-30T11:45:00.000Z",
  },
  {
    id: "5",
    content:
      "リモート会議で発言したかったのに、話し始めるとすぐに誰かに遮られてしまう",
    result: "リモート会議、発言権は通信速度より口の速さで決まる",
    style: "ogiri",
    reaction: null,
    createdAt: "2023-05-29T16:30:00.000Z",
  },
];

// 日付をフォーマットする関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "今日";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "昨日";
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
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

  useEffect(() => {
    // 実際のアプリではAPIから履歴データを取得
    // ここではモックデータを使用
    const grouped = groupPostsByDate(MOCK_POSTS);
    setGroupedPosts(grouped);
  }, []);

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 mr-2"
              aria-label="戻る"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16L5 10L12 4"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              履歴
            </h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-md mx-auto">
          {groupedPosts.length > 0 ? (
            groupedPosts.map(([date, posts]) => (
              <div key={date} className="mb-6">
                <h2
                  className="text-sm font-medium text-text-secondary mb-3"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  {date}
                </h2>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-border p-4"
                      onClick={() => router.push(`/result?id=${post.id}`)}
                    >
                      <p
                        className="text-sm text-text-secondary mb-2"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          color: "#6B7280",
                        }}
                      >
                        {post.content.length > 60
                          ? post.content.slice(0, 60) + "..."
                          : post.content}
                      </p>
                      <div className="border-t border-border my-2" />
                      <div className="flex justify-between items-center">
                        <p
                          className="text-base font-medium text-text"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            fontWeight: 500,
                          }}
                        >
                          {post.result}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              post.style === "ogiri"
                                ? "bg-yellow-50 text-amber-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                            }}
                          >
                            {post.style === "ogiri" ? "大喜利" : "川柳"}
                          </span>
                          {post.reaction && (
                            <span
                              className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                post.reaction === "good"
                                  ? "bg-gradient-to-r from-gradient-from to-gradient-to"
                                  : "bg-gray-100"
                              }`}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 11V8a5 5 0 0 1 10 0v3M7 11h10M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8"
                                  stroke={
                                    post.reaction === "good"
                                      ? "#FFFFFF"
                                      : "#6B7280"
                                  }
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 6h8M8 12h8M8 18h5M21 12c0 4.9706-4.0294 9-9 9s-9-4.0294-9-9 4.0294-9 9-9 9 4.0294 9 9z"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className="text-text-secondary text-center mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                }}
              >
                履歴はまだありません
              </p>
              <p
                className="text-text-tertiary text-center text-sm mb-6"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              >
                ムカつきを投稿すると、ここに履歴が表示されます
              </p>
              <Link
                href="/"
                className="text-white bg-gradient-to-r from-gradient-from to-gradient-to px-4 py-2 rounded-md font-medium shadow-sm"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                }}
              >
                投稿してみる
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
