"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState<"ogiri" | "senryu">("ogiri");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const MIN_CHARS = 10;
  const MAX_CHARS = 200;
  const isInputValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInputValid) return;

    setIsSubmitting(true);

    try {
      // ここで実際の変換APIを呼び出す
      // 後で実装するが、今はリダイレクトだけする

      // 結果ページへリダイレクト
      router.push(
        `/result?input=${encodeURIComponent(inputText)}&style=${style}`
      );
    } catch (error) {
      console.error("変換エラー:", error);
      alert("変換中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToHistory = () => {
    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            className="text-xl font-bold text-orange"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              color: "#F97316",
            }}
          >
            ムカログ
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={goToHistory}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="履歴"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 5V10L13 13M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {user ? (
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-gradient-from to-gradient-to flex items-center justify-center text-white cursor-pointer shadow-sm"
                onClick={() => signOut()}
              >
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-orange hover:underline"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <form onSubmit={handleSubmit}>
              <h2
                className="text-2xl font-bold text-center mb-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  color: "#111827",
                }}
              >
                今日なにムカついた？
              </h2>
              <p
                className="text-center text-text-secondary mb-6"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                あなたのムカつきを笑いに変えます
              </p>

              <div className="mb-6">
                <textarea
                  className={`w-full h-32 px-3 py-2 bg-white border border-border rounded-md shadow-sm text-text placeholder-text-placeholder focus:outline-none focus:ring-1 focus:ring-orange focus:border-orange resize-none ${
                    !isInputValid && inputText ? "border-error" : ""
                  }`}
                  placeholder="例：電車で隣に座った人が、ずっとスマホで動画を大音量で見ている..."
                  value={inputText}
                  onChange={handleInputChange}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
                  required
                />
                <div className="flex justify-between mt-1">
                  <span
                    className={`text-sm ${
                      charCount > MAX_CHARS
                        ? "text-error"
                        : "text-text-tertiary"
                    }`}
                  >
                    {charCount}/{MAX_CHARS}文字
                  </span>
                  {inputText && charCount < MIN_CHARS && (
                    <span className="text-sm text-error">
                      あと{MIN_CHARS - charCount}文字必要です
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block font-medium text-text mb-2"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  変換スタイル
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
                      style === "ogiri"
                        ? "bg-gradient-to-r from-gradient-from to-gradient-to text-white"
                        : "bg-white border border-border text-text"
                    }`}
                    onClick={() => setStyle("ogiri")}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s ease",
                    }}
                  >
                    大喜利
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
                      style === "senryu"
                        ? "bg-gradient-to-r from-gradient-from to-gradient-to text-white"
                        : "bg-white border border-border text-text"
                    }`}
                    onClick={() => setStyle("senryu")}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      transition: "all 0.2s ease",
                    }}
                  >
                    川柳
                  </button>
                </div>
                <p
                  className="text-xs text-text-tertiary mt-2"
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {style === "ogiri"
                    ? "皮肉で笑える一言に変換します"
                    : "5・7・5のリズムに変換します"}
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-4 px-4 rounded-md text-lg font-medium text-white bg-gradient-to-r from-gradient-from to-gradient-to shadow-md ${
                  !isInputValid || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                disabled={!isInputValid || isSubmitting}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                {isSubmitting ? "変換中..." : "変換！"}
              </button>
            </form>
          </div>

          <p
            className="text-center text-text-tertiary text-sm mt-6"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            今日の投稿: 3/10件
          </p>
        </div>
      </main>
    </div>
  );
}
