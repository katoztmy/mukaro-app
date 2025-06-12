// 心頭滅却師範代 - 静かに燃える青い炎のアイコン
export const ShintoumekkyakuShihanIcon = ({ size = 48, color = "#1565C0" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 炎の基部 */}
    <ellipse cx="24" cy="38" rx="8" ry="3" fill="#0D47A1" opacity="0.6" />
    
    {/* メインの青い炎 */}
    <path 
      d="M24 38C20 35 18 30 18 26C18 20 20 16 24 12C28 16 30 20 30 26C30 30 28 35 24 38Z" 
      fill={color}
    />
    <path 
      d="M24 36C21 33 20 29 20 26C20 21 22 18 24 15C26 18 28 21 28 26C28 29 27 33 24 36Z" 
      fill="#1976D2"
    />
    <path 
      d="M24 34C22 31 21 28 21 26C21 22 22 20 24 18C26 20 27 22 27 26C27 28 26 31 24 34Z" 
      fill="#2196F3"
    />
    
    {/* 炎の先端部分 */}
    <path 
      d="M24 18C23 15 22 12 23 10C24 8 25 10 26 12C27 15 25 18 24 18Z" 
      fill="#42A5F5"
    />
    
    {/* 内側の静寂を表す白い部分 */}
    <ellipse cx="24" cy="26" rx="3" ry="6" fill="#E3F2FD" opacity="0.7" />
    <ellipse cx="24" cy="26" rx="1.5" ry="3" fill="#FFF" opacity="0.5" />
    
    {/* 炎の揺らめき効果 */}
    <path 
      d="M20 30C19 27 18 24 20 22C21 20 22 22 22 24C22 27 21 30 20 30Z" 
      fill="#64B5F6" 
      opacity="0.6"
    />
    <path 
      d="M28 30C29 27 30 24 28 22C27 20 26 22 26 24C26 27 27 30 28 30Z" 
      fill="#64B5F6" 
      opacity="0.6"
    />
    
    {/* 瞑想的な静寂を表す小さな星 */}
    <circle cx="18" cy="16" r="0.8" fill="#FFF" opacity="0.8" />
    <circle cx="30" cy="14" r="0.6" fill="#FFF" opacity="0.6" />
    <circle cx="16" cy="22" r="0.5" fill="#FFF" opacity="0.7" />
    <circle cx="32" cy="20" r="0.5" fill="#FFF" opacity="0.5" />
  </svg>
);