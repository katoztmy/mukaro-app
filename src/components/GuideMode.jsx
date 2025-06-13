"use client";

import React, { useState, useEffect } from 'react';
import CountdownTimer from './guide/CountdownTimer';
import BreathingAnimation from './guide/BreathingAnimation';
import EmotionTagger from './guide/EmotionTagger';
import ReframingQuestion from './guide/ReframingQuestion';

const STEPS = {
  COUNTDOWN: 'countdown',
  BREATHING: 'breathing',
  EMOTION_TAGGING: 'emotion_tagging',
  REFRAMING: 'reframing',
  COMPLETE: 'complete'
};

export default function GuideMode({ isOpen, onClose, postId = null, mukaText = null }) {
  const [currentStep, setCurrentStep] = useState(STEPS.COUNTDOWN);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [reframingAnswer, setReframingAnswer] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(STEPS.COUNTDOWN);
      setSelectedEmotions([]);
      setReframingAnswer('');
    }
  }, [isOpen]);

  const handleStepComplete = (step, data = null) => {
    switch (step) {
      case STEPS.COUNTDOWN:
        setCurrentStep(STEPS.BREATHING);
        break;
      case STEPS.BREATHING:
        setCurrentStep(STEPS.EMOTION_TAGGING);
        break;
      case STEPS.EMOTION_TAGGING:
        setSelectedEmotions(data);
        setCurrentStep(STEPS.REFRAMING);
        break;
      case STEPS.REFRAMING:
        setReframingAnswer(data);
        handleSaveGuideData(selectedEmotions, data);
        setCurrentStep(STEPS.COMPLETE);
        break;
      case STEPS.COMPLETE:
        onClose();
        break;
    }
  };

  const handleSaveGuideData = async (emotions, answer) => {
    if (!postId) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labeledEmotions: emotions,
          reframingAnswer: answer,
        }),
      });

      if (!response.ok) {
        console.error('ガイドデータの保存に失敗しました');
      }
    } catch (error) {
      console.error('ガイドデータの保存エラー:', error);
    }
  };

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
          width: '100%',
          height: '100%',
          maxWidth: '448px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
            }}
          >
            アンガーマネジメント・ガイド
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              color: '#6B7280',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            padding: '16px',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {currentStep === STEPS.COUNTDOWN && (
            <CountdownTimer onComplete={() => handleStepComplete(STEPS.COUNTDOWN)} />
          )}

          {currentStep === STEPS.BREATHING && (
            <BreathingAnimation onComplete={() => handleStepComplete(STEPS.BREATHING)} />
          )}

          {currentStep === STEPS.EMOTION_TAGGING && (
            <EmotionTagger 
              onComplete={(emotions) => handleStepComplete(STEPS.EMOTION_TAGGING, emotions)} 
            />
          )}

          {currentStep === STEPS.REFRAMING && (
            <ReframingQuestion
              mukaText={mukaText}
              onComplete={(answer) => handleStepComplete(STEPS.REFRAMING, answer)}
            />
          )}

          {currentStep === STEPS.COMPLETE && (
            <div
              style={{
                textAlign: 'center',
                maxWidth: '300px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '24px',
                }}
              >
                🌟
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1F2937',
                  marginBottom: '16px',
                }}
              >
                お疲れ様でした
              </h3>
              <p
                style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                少し落ち着きましたか？<br />
                いつでもこのガイドを使って、心を整えることができます。
              </p>
              <button
                onClick={() => handleStepComplete(STEPS.COMPLETE)}
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                アプリに戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}