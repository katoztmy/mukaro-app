"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import {
  savePost,
  updatePostReaction,
  getPostById,
  type Reaction,
} from "@/utils/posts";
import { supabase } from "@/utils/supabase";

// SearchParamsを使用するコンポーネント
function ResultContent({
  onParamsLoaded,
}: {
  onParamsLoaded: (params: {
    input: string | null;
    styleParam: string | null;
    resultParam: string | null;
    id: string | null;
    category: string | null;
    fromHome: boolean;
  }) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    // URLパラメータから入力テキスト、スタイル、結果を取得
    const input = searchParams?.get("input");
    const styleParam = searchParams?.get("style");
    const resultParam = searchParams?.get("result");
    const id = searchParams?.get("id");
    const category = searchParams?.get("category_id");
    const fromHome = searchParams?.get("from_home") === "true"; // ホームから来たかどうかのフラグ

    onParamsLoaded({
      input,
      styleParam,
      resultParam,
      id,
      category,
      fromHome,
    });
  }, [searchParams, onParamsLoaded]);

  return null;
}

export default function ResultPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [style, setStyle] = useState<"ogiri" | "senryu">("ogiri");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [apiLimit, setApiLimit] = useState<{
    remainingCalls: number;
    maxDailyLimit: number;
  }>({ remainingCalls: 5, maxDailyLimit: 5 });
  const [token, setToken] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{
    input: string | null;
    styleParam: string | null;
    resultParam: string | null;
    id: string | null;
    category: string | null;
    fromHome: boolean;
  } | null>(null);

  // 投稿が保存されたかどうかを追跡するref
  const hasSavedRef = useRef(false);

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
    }
  };

  // URLパラメータが読み込まれたときの処理
  const handleParamsLoaded = (params: {
    input: string | null;
    styleParam: string | null;
    resultParam: string | null;
    id: string | null;
    category: string | null;
    fromHome: boolean;
  }) => {
    setUrlParams(params);
  };

  useEffect(() => {
    if (!urlParams) return;

    const { input, styleParam, resultParam, id, category, fromHome } =
      urlParams;

    if (category) {
      setCategoryId(category);
    }

    const fetchData = async () => {
      // 認証情報とAPI使用状況を取得
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          setToken(session.access_token);
          await fetchApiUsage(session.access_token);
        }
      } catch (error) {
        console.error("認証情報の取得に失敗しました:", error);
      }

      // IDがある場合は既に保存済みの投稿を取得
      if (id) {
        setPostId(id);
        hasSavedRef.current = true; // 保存済みとしてマーク

        try {
          const { post, reaction } = await getPostById(id);
          if (post) {
            setInputText(post.content);
            setStyle(post.style);
            setResult(post.result);
            if (post.category_id) {
              setCategoryId(post.category_id);
            }
          }
          if (reaction) {
            setReaction(reaction.type);
          }
          setLoading(false);
        } catch (error) {
          console.error("投稿データの取得に失敗しました:", error);
          setLoading(false);
        }
        return;
      }

      if (!input) {
        router.push("/");
        return;
      }

      setInputText(input);
      setStyle(styleParam === "senryu" ? "senryu" : "ogiri");

      // 結果パラメータがある場合はそれを使用
      if (resultParam) {
        setResult(resultParam);
        setLoading(false);

        // ホームページからの遷移の場合のみ保存処理を行う（かつまだ保存していない場合）
        if (fromHome && !hasSavedRef.current) {
          hasSavedRef.current = true; // 保存済みとしてマーク
          setSaving(true);

          try {
            // 認証トークンを使用して投稿を保存
            if (!token) {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (session?.access_token) {
                setToken(session.access_token);
              } else {
                throw new Error("認証情報が見つかりません");
              }
            }

            const newPost = await savePost({
              content: input,
              result: resultParam,
              style: styleParam === "senryu" ? "senryu" : "ogiri",
              category_id: category || undefined,
            });

            setPostId(newPost.id);

            // 新しい投稿IDをURLに追加（from_homeフラグは削除）
            const params = new URLSearchParams();
            params.set("input", input);
            params.set("style", styleParam || "ogiri");
            params.set("result", resultParam);
            params.set("id", newPost.id);
            if (category) params.set("category_id", category);

            // URLを更新してホームフラグを削除
            router.replace(`/result?${params.toString()}`);
          } catch (error) {
            console.error("投稿の保存に失敗しました:", error);
          } finally {
            setSaving(false);
          }
        }
      } else {
        // URLに結果がない場合、APIを呼び出す
        // 注: ホームページで既にAPI呼び出しがされている場合、
        // このルートには入らないはずです。念のためのフォールバック。
        const fetchResult = async () => {
          try {
            const response = await fetch("/api/convert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: input,
                style: styleParam === "senryu" ? "senryu" : "ogiri",
              }),
            });

            if (!response.ok) {
              throw new Error("変換に失敗しました");
            }

            const data = await response.json();
            setResult(data.result);

            // まだ保存していない場合のみ保存
            if (!hasSavedRef.current) {
              hasSavedRef.current = true; // 保存済みとしてマーク
              setSaving(true);

              try {
                const newPost = await savePost({
                  content: input,
                  result: data.result,
                  style: styleParam === "senryu" ? "senryu" : "ogiri",
                  category_id: category || undefined,
                });

                setPostId(newPost.id);

                // 新しい投稿IDをURLに追加
                const params = new URLSearchParams();
                params.set("input", input);
                params.set("style", styleParam || "ogiri");
                params.set("result", data.result);
                params.set("id", newPost.id);
                if (category) params.set("category_id", category);

                router.replace(`/result?${params.toString()}`);
              } catch (error) {
                console.error("投稿の保存に失敗しました:", error);
              } finally {
                setSaving(false);
              }
            }
          } catch (error) {
            console.error("API呼び出しエラー:", error);
            setResult("変換に失敗しました。もう一度試してください。");
          } finally {
            setLoading(false);
          }
        };

        fetchResult();
      }
    };

    fetchData();
  }, [urlParams, router, token]);

  const handleReaction = async (type: "like" | "dislike") => {
    setReaction(type);

    // 投稿IDがある場合はリアクションを保存
    if (postId) {
      try {
        await updatePostReaction(postId, type);
      } catch (error) {
        console.error("リアクションの更新に失敗しました:", error);
      }
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `${result}\n\n#ムカログ #${style === "ogiri" ? "大喜利" : "川柳"}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnLine = () => {
    const text = encodeURIComponent(
      `${result}\n\n#ムカログ #${style === "ogiri" ? "大喜利" : "川柳"}`
    );
    window.open(`https://line.me/R/msg/text/?${text}`, "_blank");
  };

  const convertAgain = () => {
    // APIの使用制限をチェック
    if (apiLimit.remainingCalls <= 0) {
      alert("本日の変換回数制限に達しました。明日またお試しください。");
      return;
    }

    // 新しい結果を取得するために、結果パラメータなしでAPIを再度呼び出す
    setLoading(true);
    hasSavedRef.current = false; // 保存フラグをリセット

    const fetchNewResult = async () => {
      try {
        // 認証トークンを取得
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("認証情報が見つかりません。再ログインしてください。");
        }

        const response = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
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
            alert(
              "本日のAPI使用回数の上限に達しました。明日またお試しください。"
            );
            setLoading(false);
            return;
          }

          throw new Error(errorData.error || "変換に失敗しました");
        }

        const data = await response.json();
        setResult(data.result);

        // 新しい投稿を保存
        setSaving(true);
        hasSavedRef.current = true; // 保存済みとしてマーク

        try {
          const newPost = await savePost({
            content: inputText,
            result: data.result,
            style: style,
            category_id: categoryId || undefined,
          });

          setPostId(newPost.id);

          // 新しい投稿IDをURLに追加
          const params = new URLSearchParams();
          params.set("input", inputText);
          params.set("style", style);
          params.set("result", data.result);
          params.set("id", newPost.id);
          if (categoryId) {
            params.set("category_id", categoryId);
          }
          router.replace(`/result?${params.toString()}`);

          // API使用制限情報を更新
          if (data.limit) {
            setApiLimit({
              remainingCalls: data.limit.remainingCalls,
              maxDailyLimit: data.limit.maxDailyLimit,
            });
          }
        } catch (error) {
          console.error("投稿の保存に失敗しました:", error);
        } finally {
          setSaving(false);
        }
      } catch (error) {
        console.error("API呼び出しエラー:", error);
        alert(
          error instanceof Error
            ? error.message
            : "変換に失敗しました。もう一度試してください。"
        );
        setResult("変換に失敗しました。もう一度試してください。");
      } finally {
        setLoading(false);
      }
    };

    fetchNewResult();
  };

  const newInput = () => {
    router.push("/");
  };

  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* SearchParamsを使用するコンポーネントをSuspenseでラップ */}
      <Suspense fallback={null}>
        <ResultContent onParamsLoaded={handleParamsLoaded} />
      </Suspense>

      {/* ヘッダー */}
      <Header showHistoryButton={true} />

      {/* メインコンテンツ */}
      <main style={{ maxWidth: "448px", margin: "0 auto" }}>
        {/* 元の投稿 */}
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
          <div
            style={{
              display: "inline-block",
              border: "1px solid #E5E5E5",
              borderRadius: "9999px",
              padding: "4px 11px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#0A0A0A",
                lineHeight: "1.33em",
              }}
            >
              元の投稿
            </span>
          </div>
          <p
            style={{
              fontSize: "12.47px",
              color: "#4B5563",
              lineHeight: "1.82em",
            }}
          >
            {inputText}
          </p>
        </div>

        {/* 変換結果 */}
        <div
          style={{
            marginTop: "16px",
            background: "linear-gradient(45deg, #FEFCE8, #FFF7ED)",
            border: "2px solid #FEF08A",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "26px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(to right, #A855F7, #EC4899)",
              borderRadius: "9999px",
              padding: "4px 11px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#FAFAFA",
                lineHeight: "1.33em",
              }}
            >
              {style === "ogiri" ? "大喜利" : "川柳"}
            </span>
          </div>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
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
          ) : (
            <p
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "#111827",
                textAlign: "center",
                lineHeight: "1.625em",
                whiteSpace: "pre-line",
              }}
            >
              {result}
            </p>
          )}
        </div>

        {/* リアクション */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "17px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#374151",
              textAlign: "center",
              marginBottom: "12px",
              lineHeight: "1.43em",
            }}
          >
            スッキリした？
          </h3>
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={() => handleReaction("like")}
              style={{
                flex: 1,
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                border:
                  reaction === "like"
                    ? "2px solid #10B981"
                    : "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: reaction === "like" ? "#F0FDF4" : "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/thumbs-up.svg"
                alt="👍"
                width={16}
                height={16}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  lineHeight: "1.43em",
                }}
              >
                スッキリ！
              </span>
            </button>
            <button
              onClick={() => handleReaction("dislike")}
              style={{
                flex: 1,
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                border:
                  reaction === "dislike"
                    ? "2px solid #EF4444"
                    : "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: reaction === "dislike" ? "#FEF2F2" : "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/thumbs-down.svg"
                alt="👎"
                width={16}
                height={16}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  lineHeight: "1.43em",
                }}
              >
                うーん...
              </span>
            </button>
          </div>
        </div>

        {/* シェア */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "17px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#374151",
              textAlign: "center",
              marginBottom: "12px",
              lineHeight: "1.43em",
            }}
          >
            シェアする
          </h3>
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={shareOnTwitter}
              style={{
                flex: 1,
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              <Image src="/icons/twitter.svg" alt="X" width={16} height={16} />
              <span
                style={{
                  fontSize: "12.58px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  lineHeight: "1.59em",
                }}
              >
                X (Twitter)
              </span>
            </button>
            <button
              onClick={shareOnLine}
              style={{
                flex: 1,
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              <div
                style={{ position: "relative", width: "16px", height: "16px" }}
              >
                <Image
                  src="/icons/line-1.svg"
                  alt="LINE"
                  width={16}
                  height={16}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  lineHeight: "1.43em",
                }}
              >
                LINE
              </span>
            </button>
          </div>
        </div>

        {/* アクションボタン */}
        <button
          onClick={convertAgain}
          style={{
            width: "100%",
            height: "40px",
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            border: "1px solid #E5E5E5",
            borderRadius: "6px",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          <Image
            src="/icons/convert-again-1.svg"
            alt="もう一度"
            width={16}
            height={16}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#0A0A0A",
              lineHeight: "1.43em",
            }}
          >
            もう一度変換
          </span>
        </button>

        <button
          onClick={newInput}
          style={{
            width: "100%",
            height: "40px",
            marginTop: "16px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            border: "none",
            borderRadius: "6px",
            background: "linear-gradient(to right, #FB923C, #EC4899)",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          <Image
            src="/icons/input-new.svg"
            alt="新しく"
            width={16}
            height={16}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#FAFAFA",
              lineHeight: "1.43em",
            }}
          >
            ホームに戻る
          </span>
        </button>

        {/* API使用状況を表示 */}
        <p
          style={{
            textAlign: "center",
            fontSize: "13.78px",
            color: "#6B7280",
            marginTop: "16px",
            lineHeight: "1.45em",
          }}
        >
          {loading
            ? "読み込み中..."
            : `本日の変換残り回数: ${apiLimit.remainingCalls}/${apiLimit.maxDailyLimit}回`}
        </p>
      </main>
    </div>
  );
}
