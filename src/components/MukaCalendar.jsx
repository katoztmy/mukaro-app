"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

// 日本の月名
const MONTH_NAMES = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

// 曜日名
const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

export default function MukaCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [monthStats, setMonthStats] = useState({
    totalPosts: 0,
    activeDay: 0,
    topEmotions: []
  });

  // 現在の年月
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  // 月の最初の日の曜日（日曜日=0）
  const firstDayOfWeek = firstDay.getDay();
  
  // 月の日数
  const daysInMonth = lastDay.getDate();

  // カレンダーデータを取得する関数
  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        console.error('認証トークンが取得できません');
        return;
      }

      const response = await fetch(`/api/calendar-data?year=${currentYear}&month=${currentMonth + 1}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('カレンダーデータ:', data); // デバッグログ
        setCalendarData(data.dailyData || {});
        setMonthStats(data.monthStats || {
          totalPosts: 0,
          activeDays: 0,
          topEmotions: []
        });
      } else {
        const errorData = await response.json();
        console.error('API エラー:', response.status, errorData);
      }
    } catch (error) {
      console.error('カレンダーデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // 認証トークンを取得
  const getAuthToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || '';
    } catch (error) {
      console.error('認証トークンの取得に失敗しました:', error);
      return '';
    }
  };

  // 前の月に移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // 次の月に移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // 今月に戻る
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // 投稿数に基づいて色の濃度を決定
  const getHeatmapColor = (postCount) => {
    if (postCount === 0) return '#F3F4F6'; // グレー
    if (postCount === 1) return '#FEF3C7'; // 薄い黄色
    if (postCount === 2) return '#FDE68A'; // 黄色
    if (postCount >= 3 && postCount <= 4) return '#F59E0B'; // オレンジ
    return '#DC2626'; // 赤（5回以上）
  };

  // コンポーネントマウント時とcurrentDateが変更された時にデータを取得
  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const days = [];
    
    // 前月の空白日を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 当月の日を追加
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarData[dateKey] || { postCount: 0, emotions: [] };
      
      days.push({
        day,
        dateKey,
        postCount: dayData.postCount,
        emotions: dayData.emotions,
        isToday: isToday(currentYear, currentMonth, day)
      });
    }
    
    return days;
  };

  // 今日かどうかをチェック（日本時間）
  const isToday = (year, month, day) => {
    const today = new Date();
    const jstToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    return (
      year === jstToday.getFullYear() &&
      month === jstToday.getMonth() &&
      day === jstToday.getDate()
    );
  };

  const calendarDays = generateCalendarDays();

  // スピナーアニメーション用のコンポーネント
  const Spinner = () => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 10) % 360);
      }, 50);
      
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #F97316',
        borderRadius: '50%',
        borderTopColor: 'transparent',
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.05s linear'
      }}></div>
    );
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '448px', margin: '0 auto', padding: '0 16px' }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        marginTop: '24px'
      }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ‹
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0
          }}>
            {currentYear}年 {MONTH_NAMES[currentMonth]}
          </h2>
          <button
            onClick={goToCurrentMonth}
            style={{
              fontSize: '12px',
              color: '#6B7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '4px'
            }}
          >
            今月に戻る
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          style={{
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ›
        </button>
      </div>

      {/* 月間統計 */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '12px',
          margin: 0
        }}>
          📊 今月の統計
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F97316' }}>
              {monthStats.totalPosts}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>投稿数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#3B82F6' }}>
              {monthStats.activeDays}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>活動日数</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#10B981' }}>
              {(() => {
                // 今日までの日数を計算（日本時間）
                const today = new Date();
                const jstToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
                const isCurrentMonth = currentYear === jstToday.getFullYear() && currentMonth === jstToday.getMonth();
                const daysUntilToday = isCurrentMonth ? jstToday.getDate() : daysInMonth;
                
                return monthStats.totalPosts > 0 ? Math.round((monthStats.activeDays / daysUntilToday) * 100) : 0;
              })()}%
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>活動率</div>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E5',
        borderRadius: '8px',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {/* 曜日ヘッダー */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#F9FAFB'
        }}>
          {DAY_NAMES.map((dayName, index) => (
            <div
              key={dayName}
              style={{
                padding: '12px 4px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: index === 0 ? '#EF4444' : index === 6 ? '#3B82F6' : '#6B7280'
              }}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* カレンダー本体 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}>
          {calendarDays.map((dayInfo, index) => {
            if (!dayInfo) {
              // 空白日
              return (
                <div
                  key={index}
                  style={{
                    height: '48px',
                    borderBottom: '1px solid #F3F4F6',
                    borderRight: index % 7 !== 6 ? '1px solid #F3F4F6' : 'none'
                  }}
                />
              );
            }

            return (
              <div
                key={dayInfo.dateKey}
                style={{
                  height: '48px',
                  borderBottom: '1px solid #F3F4F6',
                  borderRight: index % 7 !== 6 ? '1px solid #F3F4F6' : 'none',
                  backgroundColor: getHeatmapColor(dayInfo.postCount),
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: dayInfo.postCount > 0 ? 'pointer' : 'default'
                }}
                title={dayInfo.postCount > 0 ? `${dayInfo.postCount}件の投稿` : '投稿なし'}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: dayInfo.isToday ? 600 : 400,
                  color: dayInfo.isToday ? '#FFFFFF' : '#374151',
                  backgroundColor: dayInfo.isToday ? '#F97316' : 'transparent',
                  borderRadius: dayInfo.isToday ? '50%' : '0',
                  width: dayInfo.isToday ? '24px' : 'auto',
                  height: dayInfo.isToday ? '24px' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {dayInfo.day}
                </span>
                
                {dayInfo.postCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#374151',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '4px',
                    padding: '1px 3px',
                    minWidth: '12px',
                    textAlign: 'center'
                  }}>
                    {dayInfo.postCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 凡例 */}
      <div style={{
        marginTop: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#6B7280',
          marginBottom: '8px'
        }}>
          投稿数
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '10px', color: '#9CA3AF' }}>少ない</span>
          {[0, 1, 2, 3, 5].map((count, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: getHeatmapColor(count),
                border: '1px solid #E5E7EB',
                borderRadius: '2px'
              }}
            />
          ))}
          <span style={{ fontSize: '10px', color: '#9CA3AF' }}>多い</span>
        </div>
      </div>
    </div>
  );
}