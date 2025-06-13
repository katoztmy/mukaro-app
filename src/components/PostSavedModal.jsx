"use client";

import React from 'react';

export default function PostSavedModal({ 
  isOpen, 
  onClose, 
  onStartGuideMode,
  showGuideOption = true 
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* アイコン */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
          }}
        >
          ✅
        </div>

        {/* タイトル */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1F2937',
            marginBottom: '12px',
          }}
        >
          投稿が保存されました！
        </h3>

        {/* サブタイトル */}
        <p
          style={{
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          あなたのムカつきが変換されました。<br />
          {showGuideOption && 'もう少し心を整えてみませんか？'}
        </p>

        {/* ボタン群 */}
        <div
          style={{
            display: 'flex',
            flexDirection: showGuideOption ? 'column' : 'row',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          {showGuideOption && (
            <button
              onClick={onStartGuideMode}
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🧘</span>
              クールダウンする
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              backgroundColor: showGuideOption ? 'transparent' : '#3B82F6',
              color: showGuideOption ? '#6B7280' : '#FFFFFF',
              border: showGuideOption ? '1px solid #D1D5DB' : 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showGuideOption ? 'あとで' : '閉じる'}
          </button>
        </div>

        {showGuideOption && (
          <p
            style={{
              fontSize: '12px',
              color: '#9CA3AF',
              marginTop: '16px',
              lineHeight: 1.4,
            }}
          >
            アンガーマネジメント・ガイドで<br />
            感情と向き合いましょう
          </p>
        )}
      </div>
    </div>
  );
}