// 解脱の境地 - 宇宙と一体化している人の瞑想アイコン
export const GedatsuNoKyochiIcon = ({ size = 48, color = "#6A1B9A" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 宇宙の背景 */}
    <circle cx="24" cy="24" r="22" fill="#1A237E" opacity="0.8" />
    <circle cx="24" cy="24" r="18" fill="#283593" opacity="0.6" />
    
    {/* 星々 */}
    <circle cx="12" cy="12" r="0.8" fill="#FFF" opacity="0.9" />
    <circle cx="36" cy="10" r="0.6" fill="#FFF" opacity="0.7" />
    <circle cx="10" cy="26" r="0.5" fill="#FFF" opacity="0.8" />
    <circle cx="38" cy="28" r="0.7" fill="#FFF" opacity="0.6" />
    <circle cx="14" cy="36" r="0.4" fill="#FFF" opacity="0.9" />
    <circle cx="34" cy="38" r="0.6" fill="#FFF" opacity="0.7" />
    <circle cx="8" cy="20" r="0.3" fill="#FFF" opacity="0.8" />
    <circle cx="40" cy="16" r="0.4" fill="#FFF" opacity="0.6" />
    
    {/* 瞑想する人のシルエット */}
    <circle cx="24" cy="20" r="4" fill={color} />
    <rect x="20" y="24" width="8" height="10" rx="2" fill={color} />
    
    {/* 腕（結跏趺坐の姿勢） */}
    <ellipse cx="18" cy="28" rx="2" ry="3" fill={color} />
    <ellipse cx="30" cy="28" rx="2" ry="3" fill={color} />
    
    {/* 脚（蓮華座） */}
    <ellipse cx="20" cy="34" rx="3" ry="2" fill={color} />
    <ellipse cx="28" cy="34" rx="3" ry="2" fill={color} />
    
    {/* オーラ（エネルギー場） */}
    <circle cx="24" cy="24" r="12" fill="none" stroke="#E1BEE7" strokeWidth="1" opacity="0.6" />
    <circle cx="24" cy="24" r="15" fill="none" stroke="#CE93D8" strokeWidth="0.8" opacity="0.4" />
    <circle cx="24" cy="24" r="18" fill="none" stroke="#BA68C8" strokeWidth="0.6" opacity="0.3" />
    
    {/* 第三の目（覚醒を表す） */}
    <circle cx="24" cy="18" r="1.5" fill="#FFD700" />
    <circle cx="24" cy="18" r="0.8" fill="#FFF" />
    
    {/* 宇宙エネルギーの流れ */}
    <path 
      d="M24 8C26 10 28 12 26 14C24 16 22 14 20 12C18 10 20 8 24 8Z" 
      fill="#E91E63" 
      opacity="0.5"
    />
    <path 
      d="M24 40C22 38 20 36 22 34C24 32 26 34 28 36C30 38 28 40 24 40Z" 
      fill="#E91E63" 
      opacity="0.5"
    />
    <path 
      d="M8 24C10 22 12 20 14 22C16 24 14 26 12 28C10 30 8 28 8 24Z" 
      fill="#FF9800" 
      opacity="0.5"
    />
    <path 
      d="M40 24C38 26 36 28 34 26C32 24 34 22 36 20C38 18 40 20 40 24Z" 
      fill="#FF9800" 
      opacity="0.5"
    />
    
    {/* チャクラの光 */}
    <circle cx="24" cy="22" r="0.8" fill="#4CAF50" opacity="0.8" />
    <circle cx="24" cy="26" r="0.8" fill="#2196F3" opacity="0.8" />
    <circle cx="24" cy="30" r="0.8" fill="#FF9800" opacity="0.8" />
  </svg>
);