"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";

export default function LoginPage() {
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
    <div
      style={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "360px",
          width: "90%",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "25px",
        }}
      >
        <h1
          style={{
            fontSize: "23.81px",
            fontWeight: 700,
            color: "#F97316",
            lineHeight: "1.34em",
            textAlign: "center",
            letterSpacing: "-0.025em",
            marginBottom: "6px",
          }}
        >
          ムカログ
        </h1>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 400,
            color: "#737373",
            lineHeight: "1.43em",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          ムカつきを笑いに変える
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FEE2E2",
              borderRadius: "6px",
              color: "#DC2626",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0A0A0A",
                marginBottom: "12px",
              }}
            >
              メールアドレス
            </label>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "40px",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxSizing: "border-box",
              }}
            >
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@example.com"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 13px",
                  fontSize: "13.34px",
                  color: "#737373",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0A0A0A",
                marginBottom: "12px",
              }}
            >
              パスワード
            </label>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "40px",
                border: "1px solid #E5E5E5",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                boxSizing: "border-box",
              }}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上"
                style={{
                  width: "calc(100% - 40px)",
                  height: "100%",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 13px",
                  fontSize: "13.89px",
                  color: "#737373",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/icons/eye-icon.svg"
                  alt={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: "40px",
              background: "linear-gradient(to right, #FB923C, #EC4899)",
              borderRadius: "6px",
              border: "none",
              color: "#FAFAFA",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "1.43em",
              cursor: isLoading ? "default" : "pointer",
              opacity: isLoading ? 0.5 : 1,
              marginBottom: "0",
            }}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
            marginBottom: "0",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#4B5563",
              lineHeight: "1.43em",
            }}
          >
            アカウントをお持ちでない方は{" "}
          </span>
          <Link
            href="/signup"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#F97316",
              lineHeight: "1.43em",
              textDecoration: "none",
            }}
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
