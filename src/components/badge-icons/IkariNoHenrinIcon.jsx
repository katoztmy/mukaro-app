// 怒りの片鱗 - 龍の鱗（うろこ）一枚のアイコン
export const IkariNoHenrinIcon = ({ size = 48, color = "#1976D2" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 龍の鱗（うろこ） */}
    <path 
      d="M24 8C20 8 16 12 16 18C16 24 20 28 24 32C28 28 32 24 32 18C32 12 28 8 24 8Z" 
      fill={color}
    />
    <path 
      d="M24 10C21 10 18 13 18 18C18 23 21 26 24 30C27 26 30 23 30 18C30 13 27 10 24 10Z" 
      fill="#2196F3"
    />
    <path 
      d="M24 12C22 12 20 14 20 18C20 22 22 24 24 28C26 24 28 22 28 18C28 14 26 12 24 12Z" 
      fill="#42A5F5"
    />
    
    {/* 鱗の模様 */}
    <ellipse cx="24" cy="16" rx="3" ry="1.5" fill="#64B5F6" opacity="0.7" />
    <ellipse cx="24" cy="20" rx="2.5" ry="1" fill="#64B5F6" opacity="0.5" />
    <ellipse cx="24" cy="24" rx="2" ry="1" fill="#64B5F6" opacity="0.3" />
    
    {/* 神秘的な光 */}
    <circle cx="18" cy="12" r="1" fill="#FFF" opacity="0.8" />
    <circle cx="30" cy="14" r="0.8" fill="#FFF" opacity="0.6" />
    <circle cx="24" cy="10" r="0.6" fill="#FFF" opacity="0.9" />
  </svg>
);