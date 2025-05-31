"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 既にログインしている場合はホームページにリダイレクト
  useEffect(() => {
    if (!loading && user) {
      console.log("既にログイン済み - ホームにリダイレクト");
      router.push("/");
    }
  }, [user, loading, router]);

  // URLパラメータからエラーを取得
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "auth_error") {
      console.log("認証エラーパラメータを検出");
      setError("認証に問題が発生しました。もう一度ログインしてください。");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("ログイン試行:", email); // メールアドレスをログ

    try {
      console.log("Supabaseログイン処理開始");
      // Supabaseを使用したログイン
      const { error: signInError, success } = await signIn(email, password);

      if (signInError) {
        console.error("ログインエラー詳細:", signInError);
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
        console.error("Login error:", signInError);
        setIsLoading(false);
        return;
      }

      if (success) {
        console.log("ログイン成功 - ホームページへリダイレクト");
        // ログイン成功時はホームページにリダイレクト
        router.push("/");
      }
    } catch (error) {
      console.error("ログイン例外発生:", error);
      setError("ログインに失敗しました。入力内容を確認してください。");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ログイン済みまたはロード中の場合はローディング表示
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#F9FAFB",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>読み込み中...</p>
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
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "448px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "25px",
          margin: "190px auto",
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
              marginBottom: "24px",
            }}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "12px",
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
