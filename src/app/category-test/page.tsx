"use client";

import React from "react";
import Header from "@/components/layout/Header";
import CategoryAnalysisPanel from "@/components/CategoryAnalysisPanel";

export default function CategoryTestPage() {
  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Header showHistoryButton={true} />

      {/* メインコンテンツ */}
      <main>
        <CategoryAnalysisPanel />
      </main>
    </div>
  );
}