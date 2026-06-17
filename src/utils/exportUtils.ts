import type { Spice } from '../types';

export const exportShoppingList = (items: Spice[]): void => {
  const needRestock = items.filter((s) => s.remainingAmount <= s.minThreshold);

  if (needRestock.length === 0) {
    alert('当前没有需要补货的香料');
    return;
  }

  const now = new Date().toLocaleString('zh-CN');
  const lines: string[] = [];
  lines.push('香料购物清单');
  lines.push(`生成时间: ${now}`);
  lines.push('='.repeat(50));
  lines.push('');

  needRestock.forEach((spice, index) => {
    lines.push(`${index + 1}. ${spice.name}`);
    lines.push(`   品牌: ${spice.brand}`);
    lines.push(`   形态: ${spice.form}`);
    lines.push(`   当前余量: ${spice.remainingAmount}%`);
    lines.push(`   最低阈值: ${spice.minThreshold}%`);
    if (spice.notes) {
      lines.push(`   备注: ${spice.notes}`);
    }
    lines.push('');
  });

  lines.push('='.repeat(50));
  lines.push(`共 ${needRestock.length} 种香料需要补货`);

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `购物清单_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
