// 憤怒マスター - 後光が差している仁王像の顔アイコン
export const FunnuMasterIcon = ({ size = 48, color = "#FF6F00" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 後光 */}
    <circle cx="24" cy="24" r="20" fill="#FFF9C4" opacity="0.6" />
    <circle cx="24" cy="24" r="16" fill="#FFEB3B" opacity="0.4" />
    
    {/* 後光の光線 */}
    <line x1="24" y1="4" x2="24" y2="8" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="40" x2="24" y2="44" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <line x1="4" y1="24" x2="8" y2="24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <line x1="40" y1="24" x2="44" y2="24" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
    <line x1="10" y1="10" x2="12" y2="12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="36" x2="38" y2="38" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="38" y1="10" x2="36" y2="12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="36" x2="10" y2="38" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* 仁王像の顔 */}
    <circle cx="24" cy="24" r="12" fill="#8D6E63" />
    
    {/* 眉毛（怒った表情） */}
    <path d="M18 18L22 20" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 18L26 20" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
    
    {/* 目（威嚇的） */}
    <circle cx="20" cy="22" r="2" fill="#B71C1C" />
    <circle cx="28" cy="22" r="2" fill="#B71C1C" />
    <circle cx="20" cy="22" r="1" fill="#FFF" />
    <circle cx="28" cy="22" r="1" fill="#FFF" />
    
    {/* 鼻 */}
    <path d="M24 24L22 26L26 26Z" fill="#6D4C41" />
    
    {/* 口（怒りの表情） */}
    <path d="M20 28C20 30 22 32 24 32C26 32 28 30 28 28" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* 牙 */}
    <polygon points="22,28 21,30 23,30" fill="#FFF" />
    <polygon points="26,28 25,30 27,30" fill="#FFF" />
  </svg>
);