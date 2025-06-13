"use client";

import React from "react";
import Header from "@/components/layout/Header";
import MukaCalendar from "@/components/MukaCalendar";

export default function CalendarPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA" }}>
      <Header />
      
      <main style={{ paddingBottom: "40px" }}>
        <div style={{ maxWidth: "448px", margin: "0 auto", padding: "0 16px" }}>
          {/* ページタイトル */}
          <div style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "8px"
          }}>
            <h1 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#F97316",
              margin: 0
            }}>
              📅 ムカつきカレンダー
            </h1>
            <p style={{
              fontSize: "14px",
              color: "#6B7280",
              margin: "8px 0 0 0"
            }}>
              あなたの投稿履歴を振り返ろう
            </p>
          </div>
        </div>

        {/* カレンダーコンポーネント */}
        <MukaCalendar />
      </main>
    </div>
  );
}