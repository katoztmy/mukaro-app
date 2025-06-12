"use client";

import React from "react";
import Header from "@/components/layout/Header";
import CollectionPage from "@/components/CollectionPage";

export default function Collection() {
  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <Header showHistoryButton={true} />

      {/* メインコンテンツ */}
      <main>
        <CollectionPage />
      </main>
    </div>
  );
}