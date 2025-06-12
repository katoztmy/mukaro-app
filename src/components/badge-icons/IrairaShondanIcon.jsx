// イライラ初段 - ピキッとヒビの入った豆腐のアイコン
export const IrairaShondanIcon = ({ size = 48, color = "#E8EAF6" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 豆腐の本体 */}
    <rect x="10" y="14" width="28" height="20" rx="2" fill={color} />
    <rect x="10" y="14" width="28" height="20" rx="2" fill="#F5F5F5" />
    
    {/* ヒビ割れ */}
    <path d="M16 14L18 20L22 16L26 22L30 18L32 14" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 18L20 24L24 20L28 26L34 22" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 24L16 30L20 26L24 32L28 28L32 34" stroke="#FF5722" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* 怒りマーク */}
    <circle cx="38" cy="12" r="3" fill="#FF1744" opacity="0.8" />
    <path d="M36 12L40 12M38 10L38 14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);