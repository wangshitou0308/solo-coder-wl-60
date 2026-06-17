import type { SpiceCategory, SpiceForm, ExpiryStatus, SeasonType } from '../types';

export const SPICE_CATEGORIES: SpiceCategory[] = [
  '香草类', '辛香类', '辣椒类', '花香类', '籽类', '根茎类', '皮类', '叶类', '混合类'
];

export const SPICE_FORMS: SpiceForm[] = [
  '整粒', '粉末', '新鲜', '干燥', '碎片', '油浸', '膏状'
];

export const SEASONS: SeasonType[] = ['春季', '夏季', '秋季', '冬季'];

export function getCategoryColor(category: SpiceCategory): string {
  const colorMap: Record<SpiceCategory, string> = {
    '香草类': '#7A9E7E',
    '辛香类': '#8B5E3C',
    '辣椒类': '#C1584F',
    '花香类': '#DB7093',
    '籽类': '#E8A838',
    '根茎类': '#D2691E',
    '皮类': '#A0522D',
    '叶类': '#5C7A5F',
    '混合类': '#6366F1'
  };
  return colorMap[category] || '#6b7280';
}

export function getCategoryBgClass(category: SpiceCategory): string {
  const bgMap: Record<SpiceCategory, string> = {
    '香草类': 'bg-[#7A9E7E]/15 text-[#5C7A5F]',
    '辛香类': 'bg-[#8B5E3C]/15 text-[#6B4423]',
    '辣椒类': 'bg-[#C1584F]/15 text-[#A0453D]',
    '花香类': 'bg-pink-100 text-pink-700',
    '籽类': 'bg-[#E8A838]/15 text-[#D4952C]',
    '根茎类': 'bg-orange-100 text-orange-700',
    '皮类': 'bg-amber-100 text-amber-800',
    '叶类': 'bg-emerald-100 text-emerald-700',
    '混合类': 'bg-indigo-100 text-indigo-700'
  };
  return bgMap[category] || 'bg-gray-100 text-gray-700';
}

export function getStatusText(status: ExpiryStatus): string {
  const statusMap: Record<ExpiryStatus, string> = {
    expired: '已过期',
    urgent: '紧急',
    soon: '临期',
    normal: '正常'
  };
  return statusMap[status];
}

export function getStatusVariant(status: ExpiryStatus): 'success' | 'warning' | 'danger' | 'notice' | 'info' {
  const variantMap: Record<ExpiryStatus, 'success' | 'warning' | 'danger' | 'notice' | 'info'> = {
    expired: 'danger',
    urgent: 'warning',
    soon: 'notice',
    normal: 'success'
  };
  return variantMap[status];
}

export function getStatusBadgeClass(status: ExpiryStatus): string {
  const clsMap: Record<ExpiryStatus, string> = {
    expired: 'bg-[#C1584F]/15 text-[#C1584F] border-[#C1584F]/30',
    urgent: 'bg-[#E8A838]/15 text-[#D4952C] border-[#E8A838]/30 animate-pulse-slow',
    soon: 'bg-[#E8A838]/10 text-[#D4952C] border-[#E8A838]/20',
    normal: 'bg-[#7A9E7E]/15 text-[#5C7A5F] border-[#7A9E7E]/30'
  };
  return clsMap[status];
}

export function generateSpiceEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    '黑胡椒': '🌶️',
    '白胡椒': '⚪',
    '迷迭香': '🌿',
    '孜然': '🟡',
    '罗勒': '🌱',
    '牛至': '🍃',
    '百里香': '🌾',
    '辣椒粉': '🔴',
    '花椒': '⚫',
    '八角': '⭐',
    '桂皮': '🪵',
    '肉桂': '🪵',
    '香叶': '🍂',
    '姜黄': '🟠',
    '藏红花': '🌸',
    '香菜籽': '💚',
    '芫荽籽': '💚',
    '肉豆蔻': '🥜',
    '丁香': '🔻',
    '小茴香': '🟤',
    '豆蔻': '🌰',
    '甘草': '🍬',
    '砂仁': '🟨',
    '陈皮': '🟧',
    '干辣椒': '🌶️',
    '芥末': '🥗',
    '咖喱': '🍛',
    '香草精': '🍦',
    '五香粉': '�',
    '胡椒粉': '⚫',
    '花椒粉': '⚫',
    '辣椒面': '🌶️'
  };

  for (const key of Object.keys(emojiMap)) {
    if (name.includes(key)) {
      return emojiMap[key];
    }
  }

  const herbKeywords = ['香草', '罗勒', '迷迭香', '百里香', '牛至', '薄荷', '欧芹', '莳萝'];
  for (const keyword of herbKeywords) {
    if (name.includes(keyword)) return '🌿';
  }
  const pepperKeywords = ['胡椒', '辣椒', '椒'];
  for (const keyword of pepperKeywords) {
    if (name.includes(keyword)) return '🌶️';
  }
  const seedKeywords = ['籽', '子', '茴香', '孜然'];
  for (const keyword of seedKeywords) {
    if (name.includes(keyword)) return '🌰';
  }
  if (name.includes('桂') || name.includes('皮')) return '🪵';
  if (name.includes('花')) return '🌸';
  if (name.includes('叶')) return '🍃';

  return '✨';
}

export function getFormText(form: SpiceForm | string): string {
  return form as string;
}

export function getRemainingAmountColor(remaining: number, minThreshold: number): string {
  if (remaining <= minThreshold * 0.5) return '#C1584F';
  if (remaining <= minThreshold) return '#E8A838';
  return '#7A9E7E';
}

export function getCategoryColorForChart(idx: number): string {
  const palette = [
    '#7A9E7E', '#8B5E3C', '#E8A838', '#C1584F', 
    '#A67C52', '#DB7093', '#5C7A5F', '#D2691E', '#6366F1'
  ];
  return palette[idx % palette.length];
}
