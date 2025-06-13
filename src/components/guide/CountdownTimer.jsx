"use client";

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ onComplete }) {
  const [count, setCount] = useState(6);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // カウントダウン完了後、少し待ってから次のステップへ
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    >
      {/* 説明テキスト */}
      <p
        style={{
          fontSize: '16px',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: '48px',
          maxWidth: '280px',
        }}
      >
        まずは、頭を空っぽにして、<br />
        数字だけを追いましょう
      </p>

      {/* カウントダウン数字 */}
      <div
        style={{
          fontSize: '120px',
          fontWeight: 700,
          color: count <= 3 ? '#EF4444' : '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: count <= 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          transition: 'all 0.3s ease-in-out',
          transform: count === 0 ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {count > 0 ? count : '✓'}
      </div>

      {/* 進捗インジケーター */}
      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: index === 0 ? '#3B82F6' : '#E5E7EB',
            }}
          />
        ))}
      </div>
    </div>
  );
}