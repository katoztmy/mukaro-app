// 称号バッジアイコンの統一エクスポート
import { MukamukaNoviceIcon } from './MukamukaNoviceIcon';
import { IrairaShondanIcon } from './IrairaShondanIcon';
import { ChiritsumoFungaiIcon } from './ChiritsumoFungaiIcon';
import { IkariNoHenrinIcon } from './IkariNoHenrinIcon';
import { FumanCreatorIcon } from './FumanCreatorIcon';
import { StressIntermediateIcon } from './StressIntermediateIcon';
import { FunnuMasterIcon } from './FunnuMasterIcon';
import { ShintoumekkyakuShihanIcon } from './ShintoumekkyakuShihanIcon';
import { GedatsuNoKyochiIcon } from './GedatsuNoKyochiIcon';

export { 
  MukamukaNoviceIcon,
  IrairaShondanIcon,
  ChiritsumoFungaiIcon,
  IkariNoHenrinIcon,
  FumanCreatorIcon,
  StressIntermediateIcon,
  FunnuMasterIcon,
  ShintoumekkyakuShihanIcon,
  GedatsuNoKyochiIcon,
};

// アイコンマッピング（ID → コンポーネント）
export const BADGE_ICON_MAP = {
  mukamuka_novice: MukamukaNoviceIcon,
  iraira_shodan: IrairaShondanIcon,
  chiritsumo_fungai: ChiritsumoFungaiIcon,
  ikari_no_henrin: IkariNoHenrinIcon,
  fuman_creator: FumanCreatorIcon,
  stress_intermediate: StressIntermediateIcon,
  funnu_master: FunnuMasterIcon,
  shintoumekkyaku_shihan: ShintoumekkyakuShihanIcon,
  gedatsu_no_kyochi: GedatsuNoKyochiIcon,
};

// 称号IDからアイコンコンポーネントを取得するヘルパー関数
export const getBadgeIcon = (badgeId) => {
  return BADGE_ICON_MAP[badgeId] || null;
};