"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 実際のSupabase連携時にはここを修正
      // 今はモックなので、単純にホームにリダイレクト
      if (email && password) {
        router.push("/");
      } else {
        setError("メールアドレスとパスワードを入力してください");
      }
    } catch (error) {
      setError("ログインに失敗しました。入力内容を確認してください。");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div
        className="bg-white rounded-lg"
        style={{
          width: "100%",
          maxWidth: "448px",
          border: "1px solid #E5E5E5",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "25px",
        }}
      >
        <h1
          className="text-center font-inter"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: "-0.6px",
            color: "#F97316",
            marginBottom: "6px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ムカログ
        </h1>
        <p
          className="text-center font-inter"
          style={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#737373",
            marginBottom: "24px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ムカつきを笑いに変える
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 rounded-md text-sm font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="email"
              className="font-inter"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "14px",
                color: "#0A0A0A",
                marginBottom: "12px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              メールアドレス
            </label>
            <div className="relative" style={{ width: "398px" }}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-inter"
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "10px 13px",
                  border: "1px solid #E5E5E5",
                  borderRadius: "6px",
                  fontSize: "13.34px",
                  lineHeight: "16px",
                  color: "#0A0A0A",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                  boxSizing: "border-box",
                }}
                placeholder="your@example.com"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="password"
              className="font-inter"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "14px",
                color: "#0A0A0A",
                marginBottom: "12px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              パスワード
            </label>
            <div className="relative" style={{ width: "398px" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-inter"
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "10px 13px",
                  paddingRight: "40px",
                  border: "1px solid #E5E5E5",
                  borderRadius: "6px",
                  fontSize: "13.78px",
                  lineHeight: "16px",
                  color: "#0A0A0A",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                  boxSizing: "border-box",
                }}
                placeholder="8文字以上"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/icons/eye-icon.svg"
                    alt="パスワードを表示"
                    width={16}
                    height={16}
                    style={{ position: "absolute", inset: 0 }}
                  />
                  {!showPassword && (
                    <Image
                      src="/icons/eye-dot.svg"
                      alt=""
                      width={4}
                      height={4}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="font-inter"
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #FB923C 0%, #EC4899 100%)",
              color: "#FAFAFA",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              border: "none",
              boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: "16px",
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div
          style={{
            marginTop: "26px",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: "20px",
            fontFamily: "Inter, sans-serif",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#4B5563" }}>
            アカウントをお持ちでない方は{" "}
          </span>
          <Link
            href="/signup"
            style={{
              color: "#F97316",
              fontWeight: 500,
              textDecoration: "none",
              marginLeft: "4px",
            }}
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
