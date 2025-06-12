// ストレス中級者 - 少ししおれた観葉植物のアイコン
export const StressIntermediateIcon = ({ size = 48, color = "#689F38" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 植木鉢 */}
    <rect x="16" y="32" width="16" height="12" rx="2" fill="#8D6E63" />
    <rect x="17" y="33" width="14" height="10" rx="1" fill="#A1887F" />
    
    {/* 土 */}
    <ellipse cx="24" cy="34" rx="6" ry="1.5" fill="#5D4037" />
    
    {/* 茎 */}
    <rect x="23" y="20" width="2" height="14" fill="#558B2F" />
    
    {/* しおれた葉っぱ（左側） */}
    <path 
      d="M23 22C20 20 16 18 14 20C12 22 16 24 20 22C22 21 23 22 23 22" 
      fill={color} 
      opacity="0.7"
    />
    <path 
      d="M23 26C20 24 16 22 14 24C12 26 16 28 20 26C22 25 23 26 23 26" 
      fill="#7CB342" 
      opacity="0.6"
    />
    
    {/* しおれた葉っぱ（右側） */}
    <path 
      d="M25 24C28 22 32 20 34 22C36 24 32 26 28 24C26 23 25 24 25 24" 
      fill={color} 
      opacity="0.7"
    />
    <path 
      d="M25 28C28 26 32 24 34 26C36 28 32 30 28 28C26 27 25 28 25 28" 
      fill="#7CB342" 
      opacity="0.6"
    />
    
    {/* 元気のない頂上の葉 */}
    <path 
      d="M24 20C22 18 20 16 18 18C16 20 20 22 24 20" 
      fill="#8BC34A" 
      opacity="0.5"
    />
    <path 
      d="M24 20C26 18 28 16 30 18C32 20 28 22 24 20" 
      fill="#8BC34A" 
      opacity="0.5"
    />
    
    {/* ストレスを表す汗のしずく */}
    <ellipse cx="20" cy="16" rx="1" ry="2" fill="#81D4FA" opacity="0.6" />
    <ellipse cx="28" cy="18" rx="0.8" ry="1.5" fill="#81D4FA" opacity="0.5" />
  </svg>
);