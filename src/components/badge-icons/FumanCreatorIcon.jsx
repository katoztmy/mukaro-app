// 不満クリエイター - ペンと原稿用紙のアイコン
export const FumanCreatorIcon = ({ size = 48, color = "#8E24AA" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 原稿用紙 */}
    <rect x="8" y="10" width="26" height="32" rx="2" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
    
    {/* 原稿用紙の線 */}
    <line x1="12" y1="16" x2="30" y2="16" stroke="#E0E0E0" strokeWidth="0.5" />
    <line x1="12" y1="20" x2="30" y2="20" stroke="#E0E0E0" strokeWidth="0.5" />
    <line x1="12" y1="24" x2="30" y2="24" stroke="#E0E0E0" strokeWidth="0.5" />
    <line x1="12" y1="28" x2="30" y2="28" stroke="#E0E0E0" strokeWidth="0.5" />
    <line x1="12" y1="32" x2="30" y2="32" stroke="#E0E0E0" strokeWidth="0.5" />
    <line x1="12" y1="36" x2="30" y2="36" stroke="#E0E0E0" strokeWidth="0.5" />
    
    {/* 文字（不満を表す） */}
    <text x="14" y="18" fill="#666" fontSize="3" fontFamily="serif">ムカつく</text>
    <text x="14" y="22" fill="#666" fontSize="3" fontFamily="serif">イライラ</text>
    <text x="14" y="26" fill="#666" fontSize="3" fontFamily="serif">ストレス</text>
    
    {/* ペン */}
    <rect x="32" y="8" width="2" height="16" fill={color} transform="rotate(45 33 16)" />
    <polygon points="38,14 40,16 42,14 40,12" fill="#FFD54F" />
    <circle cx="40" cy="14" r="1" fill="#FF8F00" />
    
    {/* インクの飛び散り */}
    <circle cx="28" cy="12" r="0.5" fill={color} opacity="0.6" />
    <circle cx="30" cy="14" r="0.3" fill={color} opacity="0.4" />
    <circle cx="26" cy="16" r="0.4" fill={color} opacity="0.5" />
  </svg>
);