"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const { signUp, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // 既にログインしている場合はホームページにリダイレクト
  useEffect(() => {
    if (!loading && user) {
      console.log("既にログイン済み - ホームにリダイレクト");
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // バリデーション
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("有効なメールアドレスを入力してください");
      setIsLoading(false);
      return;
    }

    if (
      password.length < 8 ||
      !/[0-9]/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      setError("パスワードは8文字以上で、英字と数字を含める必要があります");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("利用規約とプライバシーポリシーに同意してください");
      setIsLoading(false);
      return;
    }

    try {
      // Supabaseを使用したサインアップ
      const { error: signUpError, success } = await signUp(email, password);

      if (signUpError) {
        // エラーメッセージの日本語化
        if (signUpError.message.includes("already registered")) {
          setError("このメールアドレスは既に登録されています");
        } else {
          setError(`アカウント作成に失敗しました: ${signUpError.message}`);
        }
        console.error("Signup error:", signUpError);
        setIsLoading(false);
        return;
      }

      if (success) {
        // 成功メッセージを表示
        alert("確認メールを送信しました。メールをご確認ください。");
        router.push("/login");
      }
    } catch (error) {
      setError("アカウント作成に失敗しました。入力内容を確認してください。");
      console.error("Signup error:", error);
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
                placeholder="8文字以上の英数字"
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

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0A0A0A",
                marginBottom: "12px",
              }}
            >
              パスワード（確認）
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
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再入力"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  alt={
                    showConfirmPassword
                      ? "パスワードを隠す"
                      : "パスワードを表示"
                  }
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                position: "relative",
                lineHeight: "1.43em",
              }}
            >
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  marginRight: "8px",
                  marginTop: "4px",
                  appearance: "none",
                  border: "1px solid #D1D5DB",
                  borderRadius: "4px",
                  backgroundColor: agreeTerms ? "#F97316" : "#FFFFFF",
                  position: "relative",
                  cursor: "pointer",
                }}
              />
              {agreeTerms && (
                <span
                  style={{
                    position: "absolute",
                    left: "4px",
                    top: "4px",
                    width: "8px",
                    height: "8px",
                    pointerEvents: "none",
                  }}
                >
                  <Image
                    src="/icons/check-icon.svg"
                    alt="チェック"
                    width={8}
                    height={8}
                  />
                </span>
              )}
              <label
                htmlFor="terms"
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#4B5563",
                  cursor: "pointer",
                }}
              >
                <span>
                  <Link
                    href="/terms"
                    style={{
                      color: "#F97316",
                      textDecoration: "none",
                    }}
                  >
                    利用規約
                  </Link>
                  と
                  <Link
                    href="/privacy"
                    style={{
                      color: "#F97316",
                      textDecoration: "none",
                    }}
                  >
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
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
              cursor: isLoading || !agreeTerms ? "default" : "pointer",
              opacity: isLoading || !agreeTerms ? 0.5 : 1,
              marginBottom: "0",
            }}
          >
            {isLoading ? "処理中..." : "アカウント作成"}
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
            既にアカウントをお持ちの方は{" "}
          </span>
          <Link
            href="/login"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#F97316",
              lineHeight: "1.43em",
              textDecoration: "none",
            }}
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
