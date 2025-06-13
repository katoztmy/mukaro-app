// 季節判定ユーティリティ

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  season: Season;
  name: string;
  emoji: string;
  description: string;
}

// 季節情報の定義
export const SEASON_INFO: Record<Season, SeasonInfo> = {
  spring: {
    season: 'spring',
    name: '春',
    emoji: '🌸',
    description: '新緑と桜の季節'
  },
  summer: {
    season: 'summer',
    name: '夏',
    emoji: '🌻',
    description: '暑い夏の季節'
  },
  autumn: {
    season: 'autumn',
    name: '秋',
    emoji: '🍁',
    description: '紅葉と読書の季節'
  },
  winter: {
    season: 'winter',
    name: '冬',
    emoji: '❄️',
    description: '雪と温もりの季節'
  }
};

/**
 * 現在の季節を判定する関数
 * 日本の季節に合わせて月で判定
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1; // 0-11 を 1-12 に変換

  if (month >= 3 && month <= 5) {
    return 'spring'; // 3-5月: 春
  } else if (month >= 6 && month <= 8) {
    return 'summer'; // 6-8月: 夏
  } else if (month >= 9 && month <= 11) {
    return 'autumn'; // 9-11月: 秋
  } else {
    return 'winter'; // 12-2月: 冬
  }
}

/**
 * 指定した日付の季節を判定する関数
 */
export function getSeasonFromDate(date: Date): Season {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return 'spring';
  } else if (month >= 6 && month <= 8) {
    return 'summer';
  } else if (month >= 9 && month <= 11) {
    return 'autumn';
  } else {
    return 'winter';
  }
}

/**
 * 季節の情報を取得する関数
 */
export function getSeasonInfo(season: Season): SeasonInfo {
  return SEASON_INFO[season];
}

/**
 * 現在の季節情報を取得する関数
 */
export function getCurrentSeasonInfo(): SeasonInfo {
  const currentSeason = getCurrentSeason();
  return getSeasonInfo(currentSeason);
}

/**
 * 季節限定スタイルが利用可能かチェックする関数
 */
export function isSeasonalStyleAvailable(): boolean {
  // 季節限定スタイルは常に利用可能
  return true;
}

/**
 * 季節に応じたカラーテーマを取得する関数
 */
export function getSeasonalColors(season: Season): {
  primary: string;
  secondary: string;
  background: string;
  text: string;
} {
  switch (season) {
    case 'spring':
      return {
        primary: '#EC4899', // ピンク
        secondary: '#10B981', // 緑
        background: '#FDF2F8', // 薄いピンク
        text: '#1F2937'
      };
    case 'summer':
      return {
        primary: '#3B82F6', // 青
        secondary: '#F59E0B', // オレンジ
        background: '#EFF6FF', // 薄い青
        text: '#1F2937'
      };
    case 'autumn':
      return {
        primary: '#F59E0B', // オレンジ
        secondary: '#EF4444', // 赤
        background: '#FEF3C7', // 薄い黄色
        text: '#1F2937'
      };
    case 'winter':
      return {
        primary: '#6366F1', // 紫
        secondary: '#06B6D4', // シアン
        background: '#F8FAFC', // 薄いグレー
        text: '#1F2937'
      };
  }
}