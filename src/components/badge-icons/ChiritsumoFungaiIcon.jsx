// チリツモ憤慨 - 積み上がったチリやホコリの山のアイコン
export const ChiritsumoFungaiIcon = ({ size = 48, color = "#8D6E63" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* 積み上がったチリの山 */}
    <ellipse cx="24" cy="38" rx="16" ry="4" fill={color} opacity="0.3" />
    <circle cx="24" cy="36" r="3" fill={color} />
    <circle cx="20" cy="34" r="2.5" fill="#A1887F" />
    <circle cx="28" cy="34" r="2.5" fill="#A1887F" />
    <circle cx="18" cy="32" r="2" fill={color} />
    <circle cx="30" cy="32" r="2" fill={color} />
    <circle cx="24" cy="30" r="2.5" fill="#BCAAA4" />
    <circle cx="22" cy="28" r="2" fill={color} />
    <circle cx="26" cy="28" r="2" fill="#A1887F" />
    <circle cx="24" cy="26" r="1.5" fill="#8D6E63" />
    
    {/* 舞い上がるホコリ */}
    <circle cx="14" cy="20" r="1" fill={color} opacity="0.5" />
    <circle cx="34" cy="18" r="1" fill={color} opacity="0.4" />
    <circle cx="16" cy="16" r="0.8" fill="#A1887F" opacity="0.6" />
    <circle cx="32" cy="14" r="0.8" fill="#A1887F" opacity="0.5" />
    <circle cx="12" cy="14" r="0.6" fill={color} opacity="0.4" />
    <circle cx="36" cy="12" r="0.6" fill={color} opacity="0.3" />
  </svg>
);