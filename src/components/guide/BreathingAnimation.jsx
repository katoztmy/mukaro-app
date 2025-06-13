"use client";

import React, { useState, useEffect } from 'react';

const BREATHING_PHASES = {
  INHALE: 'inhale',
  HOLD: 'hold',
  EXHALE: 'exhale'
};

const PHASE_DURATIONS = {
  [BREATHING_PHASES.INHALE]: 4000, // 4秒
  [BREATHING_PHASES.HOLD]: 4000,   // 4秒
  [BREATHING_PHASES.EXHALE]: 6000  // 6秒
};

const PHASE_TEXTS = {
  [BREATHING_PHASES.INHALE]: '息を吸って…',
  [BREATHING_PHASES.HOLD]: '止めて…',
  [BREATHING_PHASES.EXHALE]: 'ゆっくり吐いて…'
};

export default function BreathingAnimation({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(BREATHING_PHASES.INHALE);
  const [cycleCount, setCycleCount] = useState(0);
  const [circleScale, setCircleScale] = useState(1);

  useEffect(() => {
    const duration = PHASE_DURATIONS[currentPhase];
    
    // アニメーションの設定
    if (currentPhase === BREATHING_PHASES.INHALE) {
      setCircleScale(1.5);
    } else if (currentPhase === BREATHING_PHASES.HOLD) {
      setCircleScale(1.5);
    } else if (currentPhase === BREATHING_PHASES.EXHALE) {
      setCircleScale(1);
    }

    const timer = setTimeout(() => {
      if (currentPhase === BREATHING_PHASES.INHALE) {
        setCurrentPhase(BREATHING_PHASES.HOLD);
      } else if (currentPhase === BREATHING_PHASES.HOLD) {
        setCurrentPhase(BREATHING_PHASES.EXHALE);
      } else if (currentPhase === BREATHING_PHASES.EXHALE) {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        
        if (newCycleCount >= 3) {
          // 3回完了したら次のステップへ
          setTimeout(() => {
            onComplete();
          }, 1000);
        } else {
          setCurrentPhase(BREATHING_PHASES.INHALE);
        }
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentPhase, cycleCount, onComplete]);

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
          marginBottom: '32px',
          maxWidth: '280px',
        }}
      >
        円の動きに合わせて、<br />
        ゆっくりと呼吸しましょう
      </p>

      {/* 呼吸ガイドテキスト */}
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#1F2937',
          textAlign: 'center',
          marginBottom: '48px',
          minHeight: '32px',
        }}
      >
        {PHASE_TEXTS[currentPhase]}
      </div>

      {/* 呼吸アニメーション円 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '48px',
        }}
      >
        {/* 外側の円（ガイドライン） */}
        <div
          style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: '2px solid #E5E7EB',
            position: 'absolute',
          }}
        />
        
        {/* アニメーションする円 */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
            transform: `scale(${circleScale})`,
            transition: `transform ${PHASE_DURATIONS[currentPhase]}ms ease-in-out`,
            opacity: 0.8,
          }}
        />
      </div>

      {/* サイクルカウンター */}
      <div
        style={{
          fontSize: '14px',
          color: '#9CA3AF',
          marginBottom: '24px',
        }}
      >
        {cycleCount}/3 セット
      </div>

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
              backgroundColor: index === 1 ? '#3B82F6' : '#E5E7EB',
            }}
          />
        ))}
      </div>
    </div>
  );
}