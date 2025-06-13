"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { supabase } from "@/utils/supabase";
import SeasonalAnimations from "@/components/SeasonalAnimations";

// スタイルの型定義
type ConvertStyle =
  | "ogiri"
  | "senryu"
  | "manabi"
  | "total_affirmation"
  | "hissatsu_waza"
  | "news_bulletin"
  | "ijin"
  | "chuunibyou"
  | "high_consciousness"
  | "epic_tale"
  | "spring_seasonal"
  | "summer_seasonal"
  | "autumn_seasonal"
  | "winter_seasonal";

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
  spring_seasonal: "春限定🌸",
  summer_seasonal: "夏限定🌻",
  autumn_seasonal: "秋限定🍁",
  winter_seasonal: "冬限定❄️",
};

// スタイルの説明マッピング
const styleDescriptions: Record<ConvertStyle, string> = {
  ogiri: "皮肉で笑える一言に変換します",
  senryu: "5・7・5のリズムに変換します",
  manabi: "ポジティブな学びに変換します",
  total_affirmation: "あなたを全力で肯定します",
  hissatsu_waza: "RPGの必殺技風に変換します",
  news_bulletin: "ニュース速報風に伝えます",
  ijin: "偉人の名言風に変換します",
  chuunibyou: "厨二病風のセリフに変換します",
  high_consciousness: "意識高い系の言葉に変換します",
  epic_tale: "壮大な物語の始まりに変換します",
  spring_seasonal: "桜と新緑の詩的な表現に変換",
  summer_seasonal: "夏祭りと花火の爽やかな表現に変換",
  autumn_seasonal: "紅葉と読書の知的な表現に変換",
  winter_seasonal: "雪と温もりの包容力ある表現に変換",
};

export default function HomePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState<ConvertStyle>("ogiri");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [apiLimit, setApiLimit] = useState<{
    remainingCalls: number;
    maxDailyLimit: number;
  }>({ remainingCalls: 5, maxDailyLimit: 5 });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seasonTheme, setSeasonTheme] = useState<'spring' | 'summer' | 'autumn' | 'winter' | null>(null);

  // 季節アニメーションの状態（デザインテーマのみ）
  const getSeasonFromStyle = (selectedStyle: ConvertStyle): 'spring' | 'summer' | 'autumn' | 'winter' | null => {
    if (selectedStyle === 'spring_seasonal') return 'spring';
    if (selectedStyle === 'summer_seasonal') return 'summer';
    if (selectedStyle === 'autumn_seasonal') return 'autumn';
    if (selectedStyle === 'winter_seasonal') return 'winter';
    return null;
  };

  const MIN_CHARS = 10;
  const MAX_CHARS = 200;
  const isInputValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  // API使用状況を取得する関数
  const fetchApiUsage = async (authToken: string) => {
    try {
      const response = await fetch("/api/usage", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("API使用状況の取得に失敗しました");
      }

      const data = await response.json();
      if (data.success && data.limit) {
        setApiLimit({
          remainingCalls: data.limit.remainingCalls,
          maxDailyLimit: data.limit.maxDailyLimit,
        });
      }
    } catch (error) {
      console.error("API使用状況の取得エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ページロード時に認証情報とAPI使用状況を取得
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          setToken(session.access_token);
          await fetchApiUsage(session.access_token);
        }
      } catch (error) {
        console.error("セッション取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // ページがフォーカスされたときにAPI使用状況を再取得
    const handleFocus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetchApiUsage(session.access_token);
        }
      } catch (error) {
        console.error("API使用状況の取得エラー:", error);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;
    if (apiLimit.remainingCalls <= 0) {
      alert("本日のAPI使用回数の上限に達しました。明日またお試しください。");
      return;
    }

    setIsSubmitting(true);

    try {
      // 認証トークンがない場合はエラー
      if (!token) {
        throw new Error("認証情報が見つかりません。再ログインしてください。");
      }

      // APIを呼び出す
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: inputText,
          style: style,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // API制限エラーの場合は特別なメッセージを表示
        if (response.status === 429) {
          setApiLimit({
            remainingCalls: 0,
            maxDailyLimit: errorData.limit?.maxDailyLimit || 5,
          });
          throw new Error(
            "本日のAPI使用回数の上限に達しました。明日またお試しください。"
          );
        }

        throw new Error(errorData.error || "変換に失敗しました");
      }

      const data = await response.json();

      // API制限情報を更新
      if (data.limit) {
        setApiLimit({
          remainingCalls: data.limit.remainingCalls,
          maxDailyLimit: data.limit.maxDailyLimit,
        });
      }

      // 変換結果を持って結果ページに遷移（直接保存せず、保存はリザルトページで行う）
      router.push(
        `/result?input=${encodeURIComponent(
          inputText
        )}&style=${style}&result=${encodeURIComponent(
          data.result
        )}&from_home=true`
      );
    } catch (error) {
      console.error("変換エラー:", error);
      alert(
        error instanceof Error
          ? error.message
          : "変換中にエラーが発生しました。もう一度お試しください。"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: seasonTheme ? "transparent" : "#F9FAFB", minHeight: "100vh" }}>
      {/* 季節アニメーション */}
      <SeasonalAnimations season={seasonTheme} />
      
      {/* ヘッダー */}
      <Header seasonTheme={seasonTheme} />

      {/* メインコンテンツ */}
      <main style={{ maxWidth: "448px", margin: "0 auto" }}>
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "25px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "center",
                color: "#111827",
                lineHeight: "1.33em",
              }}
            >
              今日なにムカついた？
            </h2>
            <p
              style={{
                fontSize: "14px",
                textAlign: "center",
                color: "#4B5563",
                marginTop: "8px",
                lineHeight: "1.43em",
              }}
            >
              あなたのムカつきを笑いに変えます
            </p>

            <div style={{ marginTop: "24px" }}>
              <div
                style={{
                  border: "1px solid #E5E5E5",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <textarea
                  style={{
                    width: "100%",
                    height: "120px",
                    padding: "12px",
                    fontSize: "16px",
                    color: "#111827",
                    border: "none",
                    resize: "none",
                    outline: "none",
                  }}
                  placeholder="例：電車で隣に座った人が、ずっとスマホで動画を大音量で見ている…"
                  value={inputText}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: charCount > MAX_CHARS ? "#EF4444" : "#6B7280",
                  }}
                >
                  {charCount}/{MAX_CHARS}文字
                </span>
                {inputText && charCount < MIN_CHARS && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#EF4444",
                    }}
                  >
                    あと{MIN_CHARS - charCount}文字必要です
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "40px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  lineHeight: "1.43em",
                }}
              >
                変換スタイル
              </label>
              
              {/* 通常のスタイル */}
              <div style={{ marginTop: "8px" }}>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as ConvertStyle)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#0A0A0A",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage: "url('/icons/dropdown-arrow.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "12px",
                  }}
                >
                  {Object.entries(styleDisplayNames)
                    .filter(([value]) => !value.includes('seasonal'))
                    .map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>

              {/* 季節デザインテーマ */}
              <div style={{ marginTop: "16px" }}>
                <div style={{
                  background: "linear-gradient(135deg, #FEF3C7 0%, #DBEAFE 50%, #FECACA 100%)",
                  border: "1px solid #E5E5E5",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "8px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "16px" }}>✨</span>
                    <span style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#374151"
                    }}>
                      季節デザインテーマ
                    </span>
                  </div>
                  <p style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "12px",
                    margin: "0 0 12px 0"
                  }}>
                    ページの見た目を季節に合わせて変更します
                  </p>
                  
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px"
                  }}>
                    {[
                      { season: 'spring', label: '春🌸', theme: 'spring' },
                      { season: 'summer', label: '夏🌻', theme: 'summer' },
                      { season: 'autumn', label: '秋🍁', theme: 'autumn' },
                      { season: 'winter', label: '冬❄️', theme: 'winter' }
                    ].map(({ season, label, theme }) => (
                      <button
                        key={season}
                        type="button"
                        onClick={() => setSeasonTheme(seasonTheme === theme ? null : theme as any)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "6px",
                          border: seasonTheme === theme ? "2px solid #F97316" : "1px solid #E5E5E5",
                          backgroundColor: seasonTheme === theme ? "#FFF7ED" : "#FFFFFF",
                          color: seasonTheme === theme ? "#F97316" : "#374151",
                          fontWeight: seasonTheme === theme ? 600 : 500,
                          fontSize: "13px",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                          boxShadow: seasonTheme === theme ? "0 2px 4px rgba(249, 115, 22, 0.1)" : "none"
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  marginTop: "8px",
                  lineHeight: "1.33em",
                }}
              >
                {styleDescriptions[style]}
              </p>
              
              {seasonTheme && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#F97316",
                    marginTop: "8px",
                    lineHeight: "1.33em",
                    fontWeight: 500,
                  }}
                >
                  🎨 {seasonTheme === 'spring' ? '春' : seasonTheme === 'summer' ? '夏' : seasonTheme === 'autumn' ? '秋' : '冬'}テーマが適用されています
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: "48px",
                marginTop: "24px",
                borderRadius: "6px",
                background: "linear-gradient(to right, #FB923C, #EC4899)",
                fontSize: "18px",
                fontWeight: 500,
                color: "white",
                border: "none",
                boxShadow:
                  "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                opacity:
                  !isInputValid || isSubmitting || apiLimit.remainingCalls <= 0
                    ? 0.5
                    : 1,
                cursor:
                  !isInputValid || isSubmitting || apiLimit.remainingCalls <= 0
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                !isInputValid || isSubmitting || apiLimit.remainingCalls <= 0
              }
            >
              {isSubmitting ? "変換中..." : "変換！"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "13.78px",
            color: "#6B7280",
            marginTop: "16px",
            lineHeight: "1.45em",
          }}
        >
          {isLoading
            ? "読み込み中..."
            : `本日の変換残り回数: ${apiLimit.remainingCalls}/${apiLimit.maxDailyLimit}回`}
        </p>
      </main>
    </div>
  );
}
