// ムカムカ見習い - 湯気の立ったお茶碗のアイコン
export const MukamukaNoviceIcon = ({ size = 48, color = "#FFA726" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* お茶碗 */}
    <ellipse cx="24" cy="36" rx="14" ry="8" fill={color} />
    <ellipse cx="24" cy="34" rx="14" ry="8" fill="#FFC74D" />
    <ellipse cx="24" cy="32" rx="12" ry="6" fill="#FFFFFF" />
    
    {/* 湯気 */}
    <path d="M18 26C18 24 16 22 16 20C16 18 18 16 18 14" stroke="#E3F2FD" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M24 26C24 24 22 22 22 20C22 18 24 16 24 14" stroke="#E3F2FD" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M30 26C30 24 28 22 28 20C28 18 30 16 30 14" stroke="#E3F2FD" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);