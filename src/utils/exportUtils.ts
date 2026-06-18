import type { ShoppingItem } from '../types';

const priorityLabels: Record<string, string> = {
  urgent: '紧急',
  soon: '近期',
  optional: '可选',
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportShoppingListTxt = (items: ShoppingItem[]): void => {
  if (items.length === 0) {
    alert('采购清单为空');
    return;
  }

  const now = new Date().toLocaleString('zh-CN');
  const lines: string[] = [];

  lines.push('香料采购清单');
  lines.push(`生成时间: ${now}`);
  lines.push('='.repeat(50));
  lines.push('');

  const grouped: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    const key = item.priority;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const priorityOrder = ['urgent', 'soon', 'optional'];
  let index = 1;

  priorityOrder.forEach((priority) => {
    const groupItems = grouped[priority];
    if (!groupItems || groupItems.length === 0) return;

    lines.push(`【${priorityLabels[priority]}】(${groupItems.length}项)`);
    lines.push('-'.repeat(40));

    groupItems.forEach((item) => {
      lines.push(`${index}. ${item.spiceName}`);
      lines.push(`   建议采购: ${item.suggestedAmount}${item.unit}`);
      lines.push(`   类别: ${item.category || '未分类'}`);
      lines.push(`   品牌: ${item.brand || '未记录'}`);
      lines.push(`   原因: ${item.reason}`);
      if (item.addedManually) {
        lines.push(`   备注: 手动添加`);
      }
      lines.push('');
      index++;
    });
  });

  lines.push('='.repeat(50));
  lines.push(`共 ${items.length} 项待采购`);

  downloadFile(
    lines.join('\n'),
    `采购清单_${new Date().toISOString().split('T')[0]}.txt`,
    'text/plain'
  );
};

export const exportShoppingListMarkdown = (items: ShoppingItem[]): void => {
  if (items.length === 0) {
    alert('采购清单为空');
    return;
  }

  const now = new Date().toLocaleString('zh-CN');
  const lines: string[] = [];

  lines.push('# 香料采购清单');
  lines.push('');
  lines.push(`> 生成时间: ${now}`);
  lines.push('');

  const grouped: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    const key = item.priority;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const priorityOrder = ['urgent', 'soon', 'optional'];

  priorityOrder.forEach((priority) => {
    const groupItems = grouped[priority];
    if (!groupItems || groupItems.length === 0) return;

    lines.push(`## ${priorityLabels[priority]} (${groupItems.length}项)`);
    lines.push('');
    lines.push('| 序号 | 香料名称 | 建议采购量 | 类别 | 品牌 | 原因 |');
    lines.push('| --- | --- | --- | --- | --- | --- |');

    groupItems.forEach((item, idx) => {
      lines.push(
        `| ${idx + 1} | ${item.spiceName} | ${item.suggestedAmount}${item.unit} | ${item.category || '未分类'} | ${item.brand || '未记录'} | ${item.reason}${item.addedManually ? ' (手动添加)' : ''} |`
      );
    });

    lines.push('');
  });

  lines.push('---');
  lines.push(`**总计: ${items.length} 项待采购**`);

  downloadFile(
    lines.join('\n'),
    `采购清单_${new Date().toISOString().split('T')[0]}.md`,
    'text/markdown'
  );
};

export const exportShoppingListPrint = (items: ShoppingItem[]): void => {
  if (items.length === 0) {
    alert('采购清单为空');
    return;
  }

  const now = new Date().toLocaleString('zh-CN');

  const grouped: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    const key = item.priority;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const priorityOrder = ['urgent', 'soon', 'optional'];

  let sectionsHtml = '';
  let totalItems = 0;

  priorityOrder.forEach((priority) => {
    const groupItems = grouped[priority];
    if (!groupItems || groupItems.length === 0) return;

    totalItems += groupItems.length;

    const itemsHtml = groupItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">
            <input type="checkbox" style="width: 16px; height: 16px;">
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">
            ${item.spiceName}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.suggestedAmount}${item.unit}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            ${item.category || '未分类'}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            ${item.brand || '未记录'}
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            ${item.reason}${item.addedManually ? ' (手动)' : ''}
          </td>
        </tr>
      `
      )
      .join('');

    const priorityColors: Record<string, string> = {
      urgent: '#ef4444',
      soon: '#f59e0b',
      optional: '#10b981',
    };

    sectionsHtml += `
      <div style="margin-bottom: 24px;">
        <h3 style="
          margin: 0 0 12px 0;
          padding: 8px 12px;
          background-color: ${priorityColors[priority]}15;
          color: ${priorityColors[priority]};
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
        ">
          ${priorityLabels[priority]} (${groupItems.length}项)
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; width: 40px;">✓</th>
              <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">香料名称</th>
              <th style="padding: 10px 12px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; width: 100px;">采购量</th>
              <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; width: 100px;">类别</th>
              <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; width: 120px;">品牌</th>
              <th style="padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">备注</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
    `;
  });

  const printHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>香料采购清单</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      background-color: #fff;
      color: #1f2937;
      padding: 30px;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .header p {
      color: #6b7280;
      font-size: 14px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: right;
      color: #6b7280;
      font-size: 14px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 20px;">
    <button onclick="window.print()" style="
      padding: 10px 24px;
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    ">打印清单</button>
  </div>

  <div class="header">
    <h1>🌿 香料采购清单</h1>
    <p>生成时间: ${now}</p>
  </div>

  ${sectionsHtml}

  <div class="footer">
    <p>总计: <strong>${totalItems}</strong> 项待采购</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printHtml);
    printWindow.document.close();
  }
};

export const exportShoppingList = exportShoppingListTxt;
