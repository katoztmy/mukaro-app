"use client";

import React, { useState } from "react";
import { useAchievement } from "@/hooks/useAchievement";
import { getBadgeIcon } from "./badge-icons";

const CollectionPage = () => {
  const {
    counter,
    loading,
    getUnlockedBadgeDetails,
    getLockedBadgeDetails,
    getNextBadge,
    getCountToNextBadge,
    getProgressPercentage,
  } = useAchievement();


  const unlockedBadges = getUnlockedBadgeDetails();
  const lockedBadges = getLockedBadgeDetails();
  const nextBadge = getNextBadge();
  const countToNext = getCountToNextBadge();
  const progressPercentage = getProgressPercentage();



  if (loading) {
    return (
      <div style={{ maxWidth: "448px", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #F97316",
              borderRadius: "50%",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
            }}
          ></div>
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
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "448px", margin: "0 auto", padding: "0 16px" }}>
      {/* 供養カウンター表示 */}
      <div
        style={{
          marginTop: "24px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "8px",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "20px",
          textAlign: "center",
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
          🔥 現在の供養数
        </h2>
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#FB923C",
            lineHeight: "1.2em",
            marginBottom: "8px",
          }}
        >
          {counter}
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            lineHeight: "1.4em",
          }}
        >
          回のムカつきを供養しました
        </p>

        {/* 次の称号への進捗 */}
        {nextBadge && (
          <div style={{ marginTop: "16px" }}>
            <p
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginBottom: "8px",
              }}
            >
              次の称号「{nextBadge.name}」まで
            </p>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#F3F4F6",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: "100%",
                  background: "linear-gradient(to right, #FB923C, #EC4899)",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#059669",
                fontWeight: 500,
              }}
            >
              あと {countToNext} 回
            </p>
          </div>
        )}
      </div>

      {/* 獲得済み称号 */}
      <div style={{ marginTop: "24px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "12px",
            lineHeight: "1.4em",
          }}
        >
          🏆 獲得済み称号 ({unlockedBadges.length})
        </h3>

        {unlockedBadges.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {unlockedBadges.map((badge) => {
              const IconComponent = getBadgeIcon(badge.id);
              return (
                <div
                  key={badge.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #10B981",
                    borderRadius: "8px",
                    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                    padding: "16px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* 獲得済みバッジ */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      fontSize: "12px",
                    }}
                  >
                    ✅
                  </div>
                  
                  <div style={{ marginBottom: "8px" }}>
                    {IconComponent && <IconComponent size={48} />}
                  </div>
                  
                  <h4
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      lineHeight: "1.3em",
                      marginBottom: "4px",
                    }}
                  >
                    {badge.name}
                  </h4>
                  
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#6B7280",
                      lineHeight: "1.3em",
                    }}
                  >
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: "1.4em",
              }}
            >
              まだ称号を獲得していません
            </p>
          </div>
        )}
      </div>


      {/* 未獲得称号 */}
      <div style={{ marginTop: "24px", marginBottom: "40px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "12px",
            lineHeight: "1.4em",
          }}
        >
          🔒 未獲得称号 ({lockedBadges.length})
        </h3>

        {lockedBadges.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {lockedBadges.map((badge) => {
              const remaining = Math.max(0, badge.requirement - counter);
              return (
                <div
                  key={badge.id}
                  style={{
                    backgroundColor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
                    padding: "16px",
                    textAlign: "center",
                    opacity: 0.6,
                  }}
                >
                  {/* 未獲得の？アイコン */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "24px",
                        color: "#9CA3AF",
                        fontWeight: 600,
                      }}
                    >
                      ?
                    </span>
                  </div>
                  
                  <h4
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      lineHeight: "1.3em",
                      marginBottom: "4px",
                    }}
                  >
                    ？？？
                  </h4>
                  
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#059669",
                      lineHeight: "1.3em",
                      fontWeight: 500,
                    }}
                  >
                    {remaining > 0 ? `あと${remaining}回` : "解放可能"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#059669",
                lineHeight: "1.4em",
                fontWeight: 500,
              }}
            >
              🎉 すべての称号を獲得しました！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;