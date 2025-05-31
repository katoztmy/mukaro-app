"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function HomePage() {
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
      window.location.href =
        "/result?input=" + encodeURIComponent(inputText) + "&style=" + style;
    } catch (error) {
      console.error("変換エラー:", error);
      alert("変換中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange">ムカログ</h1>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => {
                /* 設定画面など */
              }}
              aria-label="メニュー"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2H14M2 8H14M2 14H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className="w-8 h-8 rounded-full bg-yellow-light flex items-center justify-center text-orange cursor-pointer"
              onClick={() => signOut()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.333 10L9.333 10M5.333 2L10.667 8L5.333 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-center text-text mb-2">
                今日なにムカついた？
              </h2>
              <p className="text-center text-text-secondary mb-6">
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

              <div className="mb-4">
                <label className="block font-medium text-text mb-2">
                  変換スタイル
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
                      style === "ogiri"
                        ? "bg-gradient-to-r from-gradient-purple-from to-gradient-purple-to text-white"
                        : "bg-white border border-border text-text"
                    }`}
                    onClick={() => setStyle("ogiri")}
                  >
                    大喜利
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
                      style === "senryu"
                        ? "bg-gradient-to-r from-gradient-purple-from to-gradient-purple-to text-white"
                        : "bg-white border border-border text-text"
                    }`}
                    onClick={() => setStyle("senryu")}
                  >
                    川柳
                  </button>
                </div>
                <p className="text-xs text-text-tertiary mt-2">
                  {style === "ogiri"
                    ? "皮肉で笑える一言に変換します"
                    : "5・7・5のリズムに変換します"}
                </p>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-md text-lg font-medium text-white bg-gradient-to-r from-gradient-from to-gradient-to shadow-md ${
                  !isInputValid || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                disabled={!isInputValid || isSubmitting}
              >
                {isSubmitting ? "変換中..." : "変換！"}
              </button>
            </form>
          </div>

          <p className="text-center text-text-tertiary text-sm mt-6">
            今日の投稿: 3/10件
          </p>
        </div>
      </main>
    </div>
  );
}
