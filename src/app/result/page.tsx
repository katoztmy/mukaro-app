"use client";

import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import {
  savePost,
  updatePostReaction,
  getPostById,
  type Reaction,
  Post,
  ConvertStyle,
} from "@/utils/posts";
import { supabase } from "@/utils/supabase";
import { useAchievement } from "@/hooks/useAchievement";
import BadgeUnlockModal from "@/components/BadgeUnlockModal";
import PostSavedModal from "@/components/PostSavedModal";
import GuideMode from "@/components/GuideMode";

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

  // searchParamsが変更されたときだけ実行されるように
  // useEffectの前にref変数で前回のパラメータを記録
  const prevSearchParamsRef = useRef<URLSearchParams | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    // 前回と同じsearchParamsの場合は処理をスキップ（無限ループ防止）
    const searchParamsString = searchParams.toString();
    if (prevSearchParamsRef.current?.toString() === searchParamsString) {
      return;
    }

    // 現在のsearchParamsを記録
    prevSearchParamsRef.current = searchParams;

    // URLパラメータから入力テキスト、スタイル、結果を取得
    const input = searchParams.get("input");
    const styleParam = searchParams.get("style");
    const resultParam = searchParams.get("result");
    const id = searchParams.get("id");
    const category = searchParams.get("category_id");
    const fromHome = searchParams.get("from_home") === "true"; // ホームから来たかどうかのフラグ

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
  const [inputText, setInputText] = useState<string>("");
  const [style, setStyle] = useState<ConvertStyle>("ogiri");
  const [result, setResult] = useState<string>("");
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

  // 称号システム関連の状態
  const {
    refreshCounter,
    newlyUnlockedBadge,
    clearNewlyUnlockedBadge,
  } = useAchievement();

  // 投稿が保存されたかどうかを追跡するref
  const hasSavedRef = useRef(false);

  // 投稿完了モーダルとガイドモードの状態
  const [showPostSavedModal, setShowPostSavedModal] = useState(false);
  const [showGuideMode, setShowGuideMode] = useState(false);

  // パラメータが既に読み込まれたかを追跡するRef
  const paramsLoadedRef = useRef(false);

  // 現在のurlParamsを追跡するRef
  const urlParamsRef = useRef(urlParams);

  // urlParamsが変更されたら参照を更新
  useEffect(() => {
    urlParamsRef.current = urlParams;
  }, [urlParams]);

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
  const handleParamsLoaded = useCallback(
    (params: {
      input: string | null;
      styleParam: string | null;
      resultParam: string | null;
      id: string | null;
      category: string | null;
      fromHome: boolean;
    }) => {
      // 既に同じパラメータでロードされていれば処理しない
      if (paramsLoadedRef.current) {
        // 最新のurlParamsをRefから取得して比較
        const isSameParams =
          JSON.stringify(params) === JSON.stringify(urlParamsRef.current);
        if (isSameParams) return;
      }

      paramsLoadedRef.current = true;
      setUrlParams(params);
    },
    []
  ); // 依存配列を空にして、useCallbackが再生成されないようにする

  // API使用状況を取得するためのuseEffect
  useEffect(() => {
    const getApiUsage = async () => {
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
    };

    getApiUsage();
  }, []);

  // URLパラメータに基づいてデータを取得・設定するuseEffect
  useEffect(() => {
    if (!urlParams) return;

    const { input, styleParam, resultParam, id, category, fromHome } =
      urlParams;

    if (category) {
      setCategoryId(category);
    }

    const fetchData = async () => {
      // IDがある場合は既に保存済みの投稿を取得
      if (id) {
        setPostId(id);
        hasSavedRef.current = true; // 保存済みとしてマーク

        try {
          const { post, reaction } = await getPostById(id);
          if (post) {
            setInputText(post.content);
            // スタイルの型安全な処理
            if (isValidStyle(post.style)) {
              console.log(
                "設定されたスタイル:",
                post.style,
                "表示名:",
                getStyleName(post.style)
              );
              setStyle(post.style);
            } else {
              // 互換性のないスタイルの場合はデフォルトに
              console.warn(`Unsupported style: ${post.style}, using default`);
              setStyle("ogiri");
            }
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

      // styleParamの処理を改善
      if (styleParam && isValidStyle(styleParam)) {
        console.log("URLパラメータから有効なスタイルを設定:", styleParam);
        setStyle(styleParam as ConvertStyle);
      } else {
        console.warn(
          `無効または未定義のスタイルパラメータ: ${styleParam}, デフォルトを使用`
        );
        setStyle("ogiri");
      }

      // URLから取得したスタイル値を安全に取得
      const safeStyle: ConvertStyle =
        styleParam && isValidStyle(styleParam)
          ? (styleParam as ConvertStyle)
          : "ogiri";

      console.log("保存に使用するスタイル:", safeStyle);

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
            const currentToken = token || (await getAuthToken());
            if (!currentToken) {
              throw new Error("認証情報が見つかりません");
            }

            // APIを使用して投稿を保存
            const newPost = await savePostViaApi({
              content: input,
              result: resultParam,
              style: safeStyle, // React stateではなくURLパラメータから直接取得した値
              categoryId: category || undefined,
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

            // 称号システムの更新
            await refreshCounter();

            // 投稿完了モーダルを表示
            setShowPostSavedModal(true);
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
            const currentToken = token || (await getAuthToken());

            const response = await fetch("/api/convert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`,
              },
              body: JSON.stringify({
                text: input,
                style: style,
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
                // 新しい投稿を保存
                const newPost = await savePostViaApi({
                  content: input,
                  result: data.result,
                  style: safeStyle, // React stateではなくURLパラメータから直接取得した値
                  categoryId: category || undefined,
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
  }, [urlParams, router]);

  const handleReaction = async (type: "like" | "dislike") => {
    setReaction(type);

    // 投稿IDがある場合はリアクションを保存
    if (postId) {
      try {
        await updatePostReaction(postId, type);
        
        // 「スッキリした」ボタンがクリックされた場合は供養カウンターを再計算
        if (type === "like") {
          await refreshCounter();
        }
      } catch (error) {
        console.error("リアクションの更新に失敗しました:", error);
      }
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `${result}\n\n#ムカログ #${getStyleName(style)}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnLine = () => {
    const text = encodeURIComponent(
      `${result}\n\n#ムカログ #${getStyleName(style)}`
    );
    window.open(`https://line.me/R/msg/text/?${text}`, "_blank");
  };

  const convertAgain = () => {
    // APIの使用制限をチェック
    if (apiLimit.remainingCalls <= 0) {
      alert("本日の変換回数制限に達しました。明日またお試しください。");
      return;
    }

    // 現在のスタイルが有効か確認
    if (!isValidStyle(style)) {
      console.warn(
        `現在のスタイルが無効です: ${style}, デフォルトを使用します`
      );
      setStyle("ogiri");
    }

    // 新しい結果を取得するために、結果パラメータなしでAPIを再度呼び出す
    setLoading(true);
    hasSavedRef.current = false; // 保存フラグをリセット

    const fetchNewResult = async () => {
      try {
        // 認証トークンを取得
        const currentToken = token || (await getAuthToken());
        if (!currentToken) {
          throw new Error("認証情報が見つかりません。再ログインしてください。");
        }

        console.log(
          "convertAgain: 使用するスタイル:",
          style,
          "表示名:",
          getStyleName(style)
        );

        const response = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
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
          const newPost = await savePostViaApi({
            content: inputText,
            result: data.result,
            style: style, // 現在のスタイルをそのまま使用
            categoryId: categoryId || undefined,
          });

          setPostId(newPost.id);

          // 新しい投稿IDをURLに追加
          const params = new URLSearchParams();
          params.set("input", inputText);
          params.set("style", style); // 現在のスタイルをそのまま使用
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
          } else {
            // data.limitがない場合は手動で更新
            await fetchApiUsage(currentToken);
          }

          // 称号システムの更新
          await refreshCounter();

          // 投稿完了モーダルを表示
          setShowPostSavedModal(true);
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

  // 投稿完了モーダルのイベントハンドラー
  const handleClosePostSavedModal = () => {
    setShowPostSavedModal(false);
  };

  const handleStartGuideMode = () => {
    setShowPostSavedModal(false);
    setShowGuideMode(true);
  };

  const handleCloseGuideMode = () => {
    setShowGuideMode(false);
  };

  // 認証トークンを取得するためのヘルパー関数
  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      setToken(session.access_token);
      return session.access_token;
    }
    return null;
  };

  // 値がConvertStyle型かどうかを検証する関数
  const isValidStyle = (styleValue: any): styleValue is ConvertStyle => {
    const validStyles: ConvertStyle[] = [
      "ogiri",
      "senryu",
      "manabi",
      "total_affirmation",
      "hissatsu_waza",
      "news_bulletin",
      "ijin",
      "chuunibyou",
      "high_consciousness",
      "epic_tale",
    ];

    console.log(
      `isValidStyle - チェック対象: "${styleValue}", 結果:`,
      validStyles.includes(styleValue as ConvertStyle)
    );
    return validStyles.includes(styleValue as ConvertStyle);
  };

  // スタイル名を取得
  const getStyleName = (styleKey: string): string => {
    const displayName = styleDisplayNames[styleKey as ConvertStyle] || styleKey;
    console.log(
      `getStyleName呼び出し - styleKey: ${styleKey}, 表示名: ${displayName}`
    );
    return displayName;
  };

  // APIを使用して投稿を保存する関数
  const savePostViaApi = async ({
    content,
    result,
    style,
    categoryId,
  }: {
    content: string;
    result: string;
    style: ConvertStyle;
    categoryId?: string;
  }) => {
    // 保存開始時のスタイル値をログ出力
    console.log("savePostViaApi - 初期スタイル:", style);
    console.log("現在有効なスタイル一覧:", [
      "ogiri",
      "senryu",
      "manabi",
      "total_affirmation",
      "hissatsu_waza",
      "news_bulletin",
      "ijin",
      "chuunibyou",
      "high_consciousness",
      "epic_tale",
    ]);

    // スタイル値のコピーを作成（関数のパラメータを直接変更しないため）
    let styleToSave = style;

    // スタイルの有効性を確認
    if (!isValidStyle(styleToSave)) {
      console.warn(
        `無効なスタイルで保存が試みられました: ${styleToSave}, デフォルトを使用します`
      );
      styleToSave = "ogiri";
    }

    // 検証後のスタイル値をログ出力
    console.log("savePostViaApi - 検証後のスタイル:", styleToSave);

    // 認証トークンを取得
    const currentToken = token || (await getAuthToken());
    if (!currentToken) {
      throw new Error("認証情報が見つかりません。再ログインしてください。");
    }

    // リクエストボディの作成
    const requestBody = {
      content,
      result,
      style: styleToSave, // 検証済みのスタイルを使用
      categoryId,
    };

    // 送信するリクエストボディをログ出力
    console.log("savePostViaApi - 送信するリクエストボディ:", requestBody);

    // API呼び出し
    const response = await fetch("/api/save-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("savePostViaApi - APIエラー:", errorData);
      throw new Error(errorData.error || "投稿の保存に失敗しました");
    }

    const data = await response.json();
    console.log("savePostViaApi - 保存成功:", data.post);

    return data.post;
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
              {(() => {
                console.log("レンダリング中のスタイル:", style);
                return getStyleName(style);
              })()}
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

      {/* 称号獲得通知モーダル */}
      <BadgeUnlockModal
        badge={newlyUnlockedBadge}
        isOpen={!!newlyUnlockedBadge}
        onClose={clearNewlyUnlockedBadge}
      />

      {/* 投稿完了モーダル */}
      <PostSavedModal
        isOpen={showPostSavedModal}
        onClose={handleClosePostSavedModal}
        onStartGuideMode={handleStartGuideMode}
        showGuideOption={true}
      />

      {/* ガイドモード */}
      <GuideMode
        isOpen={showGuideMode}
        onClose={handleCloseGuideMode}
        postId={postId}
        mukaText={inputText}
      />
    </div>
  );
}
