"use client";

import React, { useState, useEffect } from 'react';

const DEFAULT_QUESTIONS = [
  'この経験から学べることがあるとしたら何ですか？',
  'もし親友が同じ状況にいたら、どんなアドバイスをしますか？',
  'この出来事が1年後にはどう見えていると思いますか？',
  '今回の感情を感じることで、何か気づいたことはありますか？',
  'この状況をもう一度経験することになったら、何を変えたいですか？'
];

export default function ReframingQuestion({ mukaText, onComplete }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateQuestion = async () => {
      if (!mukaText) {
        // mukaTextがない場合はランダムなデフォルト質問を使用
        const randomIndex = Math.floor(Math.random() * DEFAULT_QUESTIONS.length);
        setQuestion(DEFAULT_QUESTIONS[randomIndex]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/generate-reframing-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mukaText }),
        });

        if (response.ok) {
          const data = await response.json();
          setQuestion(data.question || DEFAULT_QUESTIONS[0]);
        } else {
          // APIが失敗した場合はデフォルト質問を使用
          const randomIndex = Math.floor(Math.random() * DEFAULT_QUESTIONS.length);
          setQuestion(DEFAULT_QUESTIONS[randomIndex]);
        }
      } catch (error) {
        console.error('質問生成エラー:', error);
        // エラーが発生した場合もデフォルト質問を使用
        const randomIndex = Math.floor(Math.random() * DEFAULT_QUESTIONS.length);
        setQuestion(DEFAULT_QUESTIONS[randomIndex]);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestion();
  }, [mukaText]);

  const handleComplete = () => {
    onComplete(answer);
  };

  const handleSkip = () => {
    onComplete(''); // 空の回答で完了
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        padding: '0 8px',
        boxSizing: 'border-box',
      }}
    >
      {/* タイトル */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1F2937',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        最後に、少し考えてみませんか？
      </h3>

      {/* 質問表示 */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          width: '100%',
          border: '1px solid #E2E8F0',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#6B7280',
              }}
            >
              質問を準備しています...
            </div>
          </div>
        ) : (
          <p
            style={{
              fontSize: '16px',
              color: '#1F2937',
              lineHeight: 1.6,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {question}
          </p>
        )}
      </div>

      {/* 回答入力 */}
      <div
        style={{
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '8px',
            display: 'block',
          }}
        >
          あなたの想い（任意）
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="思ったことを自由に書いてみてください..."
          disabled={isLoading}
          style={{
            width: '100%',
            maxWidth: '100%',
            minHeight: '120px',
            padding: '16px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: 1.5,
            resize: 'vertical',
            outline: 'none',
            backgroundColor: isLoading ? '#F9FAFB' : '#FFFFFF',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* 文字数カウンター */}
      <div
        style={{
          alignSelf: 'flex-end',
          fontSize: '12px',
          color: '#9CA3AF',
          marginBottom: '32px',
        }}
      >
        {answer.length}/500文字
      </div>

      {/* ボタン */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={handleSkip}
          disabled={isLoading}
          style={{
            backgroundColor: 'transparent',
            color: '#6B7280',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          スキップ
        </button>
        <button
          onClick={handleComplete}
          disabled={isLoading}
          style={{
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          完了
        </button>
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
              backgroundColor: index === 3 ? '#3B82F6' : '#E5E7EB',
            }}
          />
        ))}
      </div>
    </div>
  );
}