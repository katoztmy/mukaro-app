"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState<"ogiri" | "senryu">("ogiri");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URLパラメータから入力テキストとスタイルを取得
    const input = searchParams.get("input");
    const styleParam = searchParams.get("style");

    if (!input) {
      router.push("/");
      return;
    }

    setInputText(input);
    setStyle(styleParam === "senryu" ? "senryu" : "ogiri");

    // ここで実際のAPI呼び出しを行う予定
    // 今はダミーの結果を表示
    setTimeout(() => {
      if (styleParam === "senryu") {
        setResult("ムカつくね\n電車の隣人は\n音漏れ魔王");
      } else {
        setResult(
          "大音量で動画を見る隣人、あなたの脳内で作られた映像の方が面白そうです"
        );
      }
      setLoading(false);
    }, 1500);
  }, [searchParams, router]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    alert("コピーしました！");
  };

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-center items-center">
          <h1 className="text-xl font-bold text-orange">変換結果</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* 元の投稿 */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-4">
            <div className="inline-block px-3 py-1 rounded-full border border-border mb-3">
              <span className="text-xs font-semibold text-text">元の投稿</span>
            </div>
            <p className="text-text-secondary text-sm">{inputText}</p>
          </div>

          {/* 変換結果 */}
          <div className="bg-gradient-to-br from-[#FEFCE8] to-[#FFF7ED] rounded-lg shadow-sm border-2 border-[#FEF08A] p-6">
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#A855F7] to-[#EC4899] mb-4">
              <span className="text-xs font-semibold text-white">
                {style === "ogiri" ? "大喜利" : "川柳"}
              </span>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-10 h-10 border-4 border-orange rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <p className="text-lg font-medium text-text text-center whitespace-pre-line">
                {result}
              </p>
            )}
          </div>

          {/* リアクション */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-4">
            <h3 className="text-center font-medium text-text mb-4">
              スッキリした？
            </h3>
            <div className="flex space-x-3">
              <button className="flex-1 py-3 px-4 flex items-center justify-center space-x-2 border border-border rounded-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7L8 10L11 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-text">スッキリ！</span>
              </button>
              <button className="flex-1 py-3 px-4 flex items-center justify-center space-x-2 border border-border rounded-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 9L8 6L11 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-text">うーん...</span>
              </button>
            </div>
          </div>

          {/* ボタン */}
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 px-4 rounded-md border border-border flex items-center justify-center space-x-2 font-medium text-text"
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 8H14M7 3L2 8L7 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>もう一度変換</span>
          </button>

          <button
            onClick={copyResult}
            className="w-full py-3 px-4 rounded-md bg-gradient-to-r from-gradient-from to-gradient-to text-white flex items-center justify-center space-x-2 font-medium"
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>新しく入力する</span>
          </button>
        </div>
      </main>
    </div>
  );
}
