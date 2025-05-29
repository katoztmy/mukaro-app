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

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-orange">ムカログ</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-text mb-6 text-center">
              変換結果
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    入力したムカつき
                  </h3>
                  <p className="p-3 bg-gray-50 rounded-md text-text">
                    {inputText}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    変換スタイル
                  </h3>
                  <p className="p-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-md inline-block px-4">
                    {style === "ogiri" ? "大喜利" : "川柳"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    変換結果
                  </h3>
                  <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100 text-text whitespace-pre-line">
                    {result}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex space-x-3">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-md text-center font-medium bg-white border border-gray-300 text-text"
            >
              もう一度変換する
            </Link>
            <button
              className="flex-1 py-3 px-4 rounded-md text-center font-medium text-white bg-gradient-to-r from-gradient-from to-gradient-to"
              onClick={() => {
                navigator.clipboard.writeText(result);
                alert("コピーしました！");
              }}
              disabled={loading}
            >
              結果をコピー
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
