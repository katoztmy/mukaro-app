"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

// useSearchParamsを使用するコンポーネントを別に作成
function LoginContent() {
  const { signIn, user, session, loading, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // ページロード時にリダイレクトフラグをクリア
  useEffect(() => {
    if (typeof window !== "undefined") {
      // セッションストレージのフラグをクリア
      sessionStorage.removeItem("auth_redirect_completed");

      // Cookieのフラグもクリア
      Cookies.remove("auth_redirect_completed", { path: "/" });
    }
  }, []);

  // リダイレクト完了フラグをセット
  const setRedirectCompleted = () => {
    // セッションストレージにリダイレクトフラグを設定
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_redirect_completed", "true");
    }

    // クッキーにもフラグをセット
    Cookies.set("auth_redirect_completed", "true", { expires: 1 / 24 }); // 1時間有効
  };

  // ログイン後のリダイレクト処理
  const handleRedirectToHome = () => {
    // 既にリダイレクト中なら何もしない
    if (redirecting) return;

    // リダイレクト状態をセット
    setRedirecting(true);

    // リダイレクト完了フラグをセット
    setRedirectCompleted();

    // セッションを再取得して確実にセッションが存在することを確認
    refreshSession().then(() => {
      // 画面遷移前にローディング画面を表示
      document.body.innerHTML = `
        <div style="
          background-color: #F9FAFB; 
          min-height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: center;
          flex-direction: column;
          font-family: sans-serif;
        ">
          <h2 style="color: #F97316; margin-bottom: 16px;">ムカログ</h2>
          <p style="margin-bottom: 24px;">ログイン成功！リダイレクトしています...</p>
          <div style="width: 40px; height: 40px; border: 4px solid #F97316; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;

      // 強制的にページをリロードしてホームページに移動
      setTimeout(() => {
        // 確実にセッションが反映されるよう少し待機
        window.location.href = "/";
      }, 1500);
    });
  };

  // 初期ロード完了のフラグを設定
  useEffect(() => {
    // 初回のみロード完了フラグを設定
    if (!initialLoadComplete && !loading) {
      setInitialLoadComplete(true);
    }
  }, [loading, initialLoadComplete]);

  // 既にログインしている場合はホームページにリダイレクト
  useEffect(() => {
    // 初期ロードが完了していない場合は何もしない
    if (!initialLoadComplete) return;

    // 既にリダイレクト処理中なら何もしない
    if (redirecting) return;

    // ユーザーとセッションが存在する場合のみリダイレクト
    if (user && session && !redirecting) {
      handleRedirectToHome();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, session, initialLoadComplete, redirecting]);

  // URLパラメータからエラーを取得
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "auth_error") {
      setError("認証に問題が発生しました。もう一度ログインしてください。");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Supabaseを使用したログイン
      const { error: signInError, success } = await signIn(email, password);

      if (signInError) {
        // エラーメッセージの日本語化
        if (signInError.message.includes("Invalid login credentials")) {
          setError("メールアドレスまたはパスワードが正しくありません");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError(
            "メールアドレスが確認されていません。メールを確認してください"
          );
        } else {
          setError(`ログインに失敗しました: ${signInError.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (success) {
        // エラーをクリア
        setError("");
        // ローディング状態を維持
        setIsLoading(true);

        // セッションを最新化
        await refreshSession();

        // ホームページにリダイレクト
        handleRedirectToHome();

        // 以降の処理が実行されないようにreturn
        return;
      }
    } catch (error) {
      setError("ログインに失敗しました。入力内容を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  // 実際にリダイレクト中またはフォーム送信中の場合のみローディング表示
  if (redirecting || isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#F9FAFB",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ color: "#F97316", marginBottom: "16px" }}>ムカログ</h2>
        <p style={{ marginBottom: "24px" }}>読み込み中...</p>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #F97316",
            borderRadius: "50%",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
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
    );
  }

  // 初期ロードが完了していない場合は単純なローディング表示
  if (!initialLoadComplete) {
    return (
      <div
        style={{
          backgroundColor: "#F9FAFB",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ color: "#F97316", marginBottom: "16px" }}>ムカログ</h2>
        <p style={{ marginBottom: "24px" }}>準備中...</p>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #F97316",
            borderRadius: "50%",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
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
    );
  }

  // ログイン済みの場合は何も表示せずリダイレクト（useEffectで処理）
  if (user) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      <main
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#F97316",
              marginBottom: "8px",
              lineHeight: "1.33em",
            }}
          >
            ムカログ
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#4B5563",
              lineHeight: "1.43em",
            }}
          >
            あなたのムカつきを笑いに変えます
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "24px",
              textAlign: "center",
              lineHeight: "1.33em",
            }}
          >
            ログイン
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "8px",
                  lineHeight: "1.43em",
                }}
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  color: "#111827",
                  border: "1px solid #E5E5E5",
                  borderRadius: "6px",
                  outline: "none",
                  lineHeight: "1.43em",
                }}
                placeholder="example@example.com"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "8px",
                  lineHeight: "1.43em",
                }}
              >
                パスワード
              </label>
              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#111827",
                    border: "1px solid #E5E5E5",
                    borderRadius: "6px",
                    outline: "none",
                    lineHeight: "1.43em",
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                  }}
                  aria-label={
                    showPassword ? "パスワードを隠す" : "パスワードを表示"
                  }
                >
                  <Image
                    src={
                      showPassword ? "/icons/eye-slash.svg" : "/icons/eye.svg"
                    }
                    alt={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  color: "#EF4444",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginBottom: "24px",
                  lineHeight: "1.43em",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "6px",
                background: "linear-gradient(to right, #FB923C, #EC4899)",
                fontSize: "16px",
                fontWeight: 500,
                color: "white",
                border: "none",
                boxShadow:
                  "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                lineHeight: "1.5em",
              }}
              disabled={isLoading}
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#4B5563",
              lineHeight: "1.43em",
            }}
          >
            アカウントをお持ちでない場合は
            <Link
              href="/signup"
              style={{
                color: "#F97316",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              新規登録
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

// フォールバックのローディングコンポーネント
function LoginFallback() {
  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ color: "#F97316", marginBottom: "16px" }}>ムカログ</h2>
      <p style={{ marginBottom: "24px" }}>読み込み中...</p>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #F97316",
          borderRadius: "50%",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }}
      />
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
  );
}

// メインコンポーネント
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
