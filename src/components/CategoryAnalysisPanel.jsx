"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase";

const CategoryAnalysisPanel = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ analyzed: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const startBatchAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress({ analyzed: 0, total: 0 });
    setResults([]);
    setIsComplete(false);

    try {
      // 認証トークン取得
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("認証エラーです。再ログインしてください。");
        return;
      }

      let allResults = [];
      let totalAnalyzed = 0;

      // 最大10回ループ（100件まで分析）
      for (let i = 0; i < 10; i++) {
        const response = await fetch("/api/analyze-category", {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.analyzed === 0) {
          // 分析対象がなくなった
          break;
        }

        totalAnalyzed += data.analyzed;
        allResults = [...allResults, ...data.results];
        
        setProgress({ analyzed: totalAnalyzed, total: totalAnalyzed + (data.total - data.analyzed) });
        setResults(allResults);

        // 少し待機してから次のバッチを実行
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsComplete(true);
      
    } catch (error) {
      console.error("一括分析エラー:", error);
      alert("分析中にエラーが発生しました: " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCategories = async () => {
    if (!confirm("すべての分析結果をリセットして再分析しますか？")) {
      return;
    }

    setIsResetting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("認証エラーです。再ログインしてください。");
        return;
      }

      const response = await fetch("/api/reset-categories", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(`${data.resetCount}件の分析結果をリセットしました。`);
      
      // 状態をリセット
      setResults([]);
      setIsComplete(false);
      setProgress({ analyzed: 0, total: 0 });

    } catch (error) {
      console.error("リセットエラー:", error);
      alert("リセット中にエラーが発生しました: " + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "448px", 
      margin: "20px auto", 
      padding: "0 16px" 
    }}>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "8px",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "16px",
            lineHeight: "1.4em",
          }}
        >
          🤖 AIカテゴリ分析
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            lineHeight: "1.4em",
            marginBottom: "20px",
          }}
        >
          過去の投稿をAIで自動分析し、カテゴリを設定します。
        </p>

        {!isAnalyzing && !isComplete && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={startBatchAnalysis}
              style={{
                flex: 1,
                padding: "12px 24px",
                background: "linear-gradient(to right, #FB923C, #EC4899)",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(251, 146, 60, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              🚀 過去データの分析を開始
            </button>
            
            <button
              onClick={resetCategories}
              disabled={isResetting}
              style={{
                padding: "12px 16px",
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: isResetting ? "not-allowed" : "pointer",
                opacity: isResetting ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {isResetting ? "⏳" : "🔄"}
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#F3F4F6",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: progress.total > 0 ? `${(progress.analyzed / progress.total) * 100}%` : "0%",
                  height: "100%",
                  background: "linear-gradient(to right, #FB923C, #EC4899)",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            
            <p
              style={{
                fontSize: "14px",
                color: "#374151",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              分析中... {progress.analyzed}件完了
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid #F97316",
                  borderRadius: "50%",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        )}

        {isComplete && (
          <div>
            <div
              style={{
                backgroundColor: "#F0FDF4",
                border: "2px solid #BBF7D0",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "24px", marginBottom: "8px", display: "block" }}>🎉</span>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#059669",
                  margin: 0,
                }}
              >
                分析完了！{progress.analyzed}件の投稿を分析しました
              </p>
            </div>

            {results.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  分析結果サンプル:
                </h3>
                
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {results.slice(0, 5).map((result, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "6px",
                        padding: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#374151",
                          margin: "0 0 4px 0",
                        }}
                      >
                        📁 {result.category.categoryName}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#6B7280",
                          margin: 0,
                        }}
                      >
                        信頼度: {Math.round(result.category.confidence * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                padding: "10px 20px",
                backgroundColor: "#F3F4F6",
                color: "#374151",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "16px",
              }}
            >
              ページを更新
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalysisPanel;