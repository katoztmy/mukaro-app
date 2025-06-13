"use client";

import React, { useState } from 'react';

const EMOTION_TAGS = [
  { id: 'sad', label: '悲しい', color: '#3B82F6' },
  { id: 'frustrated', label: '悔しい', color: '#EF4444' },
  { id: 'anxious', label: '不安', color: '#F59E0B' },
  { id: 'empty', label: '虚しい', color: '#6B7280' },
  { id: 'embarrassed', label: '恥ずかしい', color: '#EC4899' },
  { id: 'disappointed', label: 'がっかりした', color: '#8B5CF6' },
  { id: 'unknown', label: 'わからない', color: '#10B981' }
];

export default function EmotionTagger({ onComplete }) {
  const [selectedEmotions, setSelectedEmotions] = useState([]);

  const handleEmotionToggle = (emotionId) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotionId)) {
        return prev.filter(id => id !== emotionId);
      } else {
        return [...prev, emotionId];
      }
    });
  };

  const handleNext = () => {
    // 選択された感情IDを感情名に変換
    const selectedEmotionNames = selectedEmotions.map(id => 
      EMOTION_TAGS.find(tag => tag.id === id)?.label
    ).filter(Boolean);
    
    onComplete(selectedEmotionNames);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        padding: '0 16px',
      }}
    >
      {/* タイトル */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1F2937',
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        今感じている本当の気持ちは<br />
        どれですか？
      </h3>

      {/* サブタイトル */}
      <p
        style={{
          fontSize: '14px',
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        複数選択可能です
      </p>

      {/* 感情タグ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '48px',
          width: '100%',
        }}
      >
        {EMOTION_TAGS.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion.id);
          
          return (
            <button
              key={emotion.id}
              onClick={() => handleEmotionToggle(emotion.id)}
              style={{
                padding: '12px 16px',
                borderRadius: '24px',
                border: isSelected ? `2px solid ${emotion.color}` : '2px solid #E5E7EB',
                backgroundColor: isSelected ? `${emotion.color}15` : '#FFFFFF',
                color: isSelected ? emotion.color : '#6B7280',
                fontSize: '14px',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              {emotion.label}
            </button>
          );
        })}
      </div>

      {/* 選択状況 */}
      {selectedEmotions.length > 0 && (
        <div
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: '#4B5563',
              marginBottom: '8px',
            }}
          >
            選択された感情：
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {selectedEmotions.map(emotionId => {
              const emotion = EMOTION_TAGS.find(tag => tag.id === emotionId);
              return (
                <span
                  key={emotionId}
                  style={{
                    backgroundColor: emotion.color,
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {emotion.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        disabled={selectedEmotions.length === 0}
        style={{
          backgroundColor: selectedEmotions.length > 0 ? '#3B82F6' : '#E5E7EB',
          color: selectedEmotions.length > 0 ? '#FFFFFF' : '#9CA3AF',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: selectedEmotions.length > 0 ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease-in-out',
          marginBottom: '24px',
        }}
      >
        次へ
      </button>

      {/* 進捗インジケーター */}
      <div
        style={{
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
              backgroundColor: index === 2 ? '#3B82F6' : '#E5E7EB',
            }}
          />
        ))}
      </div>
    </div>
  );
}