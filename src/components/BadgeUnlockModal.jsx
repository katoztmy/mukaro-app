"use client";

import React from "react";
import { getBadgeIcon } from "./badge-icons";

const BadgeUnlockModal = ({ badge, isOpen, onClose }) => {
  if (!isOpen || !badge) return null;

  const IconComponent = getBadgeIcon(badge.id);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        // モーダル背景クリックでは閉じない（要件通り背景はクリック不可）
        e.stopPropagation();
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "32px",
          maxWidth: "360px",
          width: "90%",
          textAlign: "center",
          position: "relative",
          animation: "modalFadeIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* アニメーション定義 */}
        <style jsx>{`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes celebrate {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          
          .celebrate-icon {
            animation: celebrate 0.6s ease-in-out;
          }
        `}</style>

        {/* 称号獲得タイトル */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "8px",
              lineHeight: "1.2em",
            }}
          >
            🎉 称号獲得！
          </h2>
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(to right, #FB923C, #EC4899)",
              margin: "0 auto",
              borderRadius: "1px",
            }}
          />
        </div>

        {/* バッジアイコン */}
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <div
            className="celebrate-icon"
            style={{
              display: "inline-block",
              padding: "16px",
              backgroundColor: "#F8FAFC",
              borderRadius: "50%",
              border: "3px solid #E5E7EB",
            }}
          >
            {IconComponent && (
              <IconComponent size={80} />
            )}
          </div>
        </div>

        {/* 称号名 */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "16px",
            lineHeight: "1.3em",
          }}
        >
          {badge.name}
        </h3>

        {/* お祝いメッセージ */}
        <p
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "#6B7280",
            lineHeight: "1.5em",
            marginBottom: "32px",
          }}
        >
          {badge.message}
        </p>

        {/* 達成条件表示 */}
        <div
          style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#059669",
              margin: 0,
            }}
          >
            ✅ {badge.description}
          </p>
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 24px",
            background: "linear-gradient(to right, #FB923C, #EC4899)",
            color: "#FFFFFF",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            lineHeight: "1.5em",
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
          すごい！
        </button>

        {/* 装飾的な要素（キラキラ効果） */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "24px",
            animation: "celebrate 1s ease-in-out infinite",
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "20px",
            fontSize: "20px",
            animation: "celebrate 1.2s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        >
          🌟
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            fontSize: "18px",
            animation: "celebrate 0.8s ease-in-out infinite",
            animationDelay: "0.4s",
          }}
        >
          💫
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "30px",
            fontSize: "16px",
            animation: "celebrate 1.1s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        >
          ⭐
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;