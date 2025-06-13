"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPostsCount } from "@/utils/posts";

// 称号の定義
export const ACHIEVEMENT_BADGES = [
  {
    id: "mukamuka_novice",
    name: "ムカムカ見習い",
    requirement: 1,
    description: "初めての供養を達成しました！",
    message: "ムカつきの道の第一歩を踏み出しました！",
  },
  {
    id: "iraira_shodan",
    name: "イライラ初段",
    requirement: 5,
    description: "5回の供養を達成しました！",
    message: "イライラと上手に向き合えるようになってきました！",
  },
  {
    id: "chiritsumo_fungai",
    name: "チリツモ憤慨",
    requirement: 10,
    description: "10回の供養を達成しました！",
    message: "小さなムカつきも積み重ねが大切ですね！",
  },
  {
    id: "ikari_no_henrin",
    name: "怒りの片鱗",
    requirement: 20,
    description: "20回の供養を達成しました！",
    message: "怒りの力を感じ始めています！",
  },
  {
    id: "fuman_creator",
    name: "不満クリエイター",
    requirement: 35,
    description: "35回の供養を達成しました！",
    message: "不満を創造的に昇華する才能が開花しました！",
  },
  {
    id: "stress_intermediate",
    name: "ストレス中級者",
    requirement: 50,
    description: "50回の供養を達成しました！",
    message: "ストレスとの付き合い方が上手になりました！",
  },
  {
    id: "funnu_master",
    name: "憤怒マスター",
    requirement: 75,
    description: "75回の供養を達成しました！",
    message: "あなたの怒りはもはや芸術の域に達しました！",
  },
  {
    id: "shintoumekkyaku_shihan",
    name: "心頭滅却師範代",
    requirement: 100,
    description: "100回の供養を達成しました！",
    message: "心を静めることの真の意味を理解しました！",
  },
  {
    id: "gedatsu_no_kyochi",
    name: "解脱の境地",
    requirement: 150,
    description: "150回の供養を達成しました！",
    message: "すべてのムカつきから解き放たれた境地に達しました！",
  },
];

// ローカルストレージのキー（獲得済み称号のみ保存）
const STORAGE_KEY = "mukalogUnlockedBadges";

// デフォルトデータ
const DEFAULT_UNLOCKED_BADGES = [];

export const useAchievement = () => {
  const [counter, setCounter] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState(DEFAULT_UNLOCKED_BADGES);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  // ローカルストレージから獲得済み称号を読み込む
  const loadUnlockedBadges = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedBadges = JSON.parse(stored);
        setUnlockedBadges(parsedBadges || []);
      }
    } catch (error) {
      console.error("Unlocked badges load error:", error);
      setUnlockedBadges(DEFAULT_UNLOCKED_BADGES);
    }
  }, []);

  // 開発用：称号データをリセットする関数
  const resetAchievements = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUnlockedBadges([]);
    setNewlyUnlockedBadge(null);
    console.log("称号データをリセットしました");
  }, []);

  // Supabaseから実際の投稿数を取得
  const loadPostCount = useCallback(async () => {
    try {
      const postCount = await getUserPostsCount();
      setCounter(postCount);
      return postCount;
    } catch (error) {
      console.error("Post count load error:", error);
      return 0;
    }
  }, []);

  // ローカルストレージに獲得済み称号を保存する
  const saveUnlockedBadges = useCallback((badges) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
      setUnlockedBadges(badges);
    } catch (error) {
      console.error("Unlocked badges save error:", error);
    }
  }, []);

  // 新しい称号獲得をチェックする
  const checkForNewBadge = useCallback((currentCounter, currentUnlockedBadges) => {
    return ACHIEVEMENT_BADGES.find(
      (badge) =>
        currentCounter >= badge.requirement && !currentUnlockedBadges.includes(badge.id)
    );
  }, []);

  // 投稿後にカウンターを再計算（新規投稿時に呼ばれる）
  const refreshCounter = useCallback(async () => {
    const newCounter = await loadPostCount();
    
    // 新しい称号の獲得をチェック
    const newBadge = checkForNewBadge(newCounter, unlockedBadges);
    if (newBadge) {
      const newUnlockedBadges = [...unlockedBadges, newBadge.id];
      saveUnlockedBadges(newUnlockedBadges);
      setNewlyUnlockedBadge(newBadge);
    }
    
    return newCounter;
  }, [loadPostCount, unlockedBadges, saveUnlockedBadges, checkForNewBadge]);

  // 初期化時にデータを読み込み
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      loadUnlockedBadges();
      const currentCount = await loadPostCount();
      
      // 初期化時に既に条件を満たしている称号があるかチェック
      const storedBadges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newBadge = checkForNewBadge(currentCount, storedBadges);
      if (newBadge) {
        const newUnlockedBadges = [...storedBadges, newBadge.id];
        saveUnlockedBadges(newUnlockedBadges);
        setNewlyUnlockedBadge(newBadge);
      }
      
      setLoading(false);
    };
    
    initializeData();
  }, [loadUnlockedBadges, loadPostCount, checkForNewBadge, saveUnlockedBadges]);

  // 新しく獲得した称号のモーダルを閉じる
  const clearNewlyUnlockedBadge = useCallback(() => {
    setNewlyUnlockedBadge(null);
  }, []);

  // 獲得済みの称号の詳細を取得
  const getUnlockedBadgeDetails = useCallback(() => {
    return unlockedBadges.map((badgeId) =>
      ACHIEVEMENT_BADGES.find((badge) => badge.id === badgeId)
    ).filter(Boolean);
  }, [unlockedBadges]);

  // 未獲得の称号の詳細を取得
  const getLockedBadgeDetails = useCallback(() => {
    return ACHIEVEMENT_BADGES.filter(
      (badge) => !unlockedBadges.includes(badge.id)
    );
  }, [unlockedBadges]);

  // 次に獲得できる称号を取得
  const getNextBadge = useCallback(() => {
    const lockedBadges = getLockedBadgeDetails();
    return lockedBadges.find((badge) => badge.requirement > counter) || null;
  }, [counter, getLockedBadgeDetails]);

  // 次の称号まであと何回必要かを取得
  const getCountToNextBadge = useCallback(() => {
    const nextBadge = getNextBadge();
    if (!nextBadge) return 0;
    return Math.max(0, nextBadge.requirement - counter);
  }, [counter, getNextBadge]);

  // 進捗パーセンテージを取得
  const getProgressPercentage = useCallback(() => {
    const nextBadge = getNextBadge();
    if (!nextBadge) return 100;

    const previousRequirement = 
      ACHIEVEMENT_BADGES
        .filter((badge) => badge.requirement < nextBadge.requirement)
        .sort((a, b) => b.requirement - a.requirement)[0]?.requirement || 0;

    const progress = 
      ((counter - previousRequirement) / 
       (nextBadge.requirement - previousRequirement)) * 100;

    return Math.min(100, Math.max(0, progress));
  }, [counter, getNextBadge]);

  // 手動で称号解放をチェックする関数
  const checkAndUnlockBadges = useCallback(async () => {
    const currentCount = await loadPostCount();
    const currentUnlockedBadges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // 解放可能な称号をすべてチェック
    const unlockableBadges = ACHIEVEMENT_BADGES.filter(
      (badge) => currentCount >= badge.requirement && !currentUnlockedBadges.includes(badge.id)
    );
    
    if (unlockableBadges.length > 0) {
      const newUnlockedBadges = [...currentUnlockedBadges, ...unlockableBadges.map(b => b.id)];
      saveUnlockedBadges(newUnlockedBadges);
      
      // 最初の称号のみモーダル表示
      setNewlyUnlockedBadge(unlockableBadges[0]);
      return unlockableBadges.length;
    }
    
    return 0;
  }, [loadPostCount, saveUnlockedBadges]);

  return {
    // データ
    counter,
    unlockedBadges,
    newlyUnlockedBadge,
    loading,

    // アクション
    refreshCounter,
    clearNewlyUnlockedBadge,
    checkAndUnlockBadges,
    resetAchievements, // 開発用

    // 取得メソッド
    getUnlockedBadgeDetails,
    getLockedBadgeDetails,
    getNextBadge,
    getCountToNextBadge,
    getProgressPercentage,

    // 定数
    allBadges: ACHIEVEMENT_BADGES,
  };
};