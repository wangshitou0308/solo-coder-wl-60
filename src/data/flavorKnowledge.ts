import type { FlavorKnowledge } from '../types';

export const flavorKnowledgeData: FlavorKnowledge[] = [
  {
    id: 'flavor-001',
    spiceName: '黑胡椒',
    category: '辛香类',
    flavorProfile: '强烈的辛辣香气，带有木质和轻微的柑橘底味，磨碎后香气更浓郁',
    commonUses: ['牛排调味', '汤品增香', '腌制肉类', '沙拉调味', '炒蛋提味'],
    compatibleIngredients: ['牛肉', '猪肉', '鸡肉', '土豆', '番茄', '奶酪', '鸡蛋', '蘑菇'],
    pairingTaboos: ['甜点', '水果类菜品', '清淡的日式刺身'],
    cuisines: ['西餐', '中餐', '印度餐', '东南亚餐']
  },
  {
    id: 'flavor-002',
    spiceName: '迷迭香',
    category: '香草类',
    flavorProfile: '浓郁的松木般清香，带有微微的苦味和樟脑气息，回味悠长',
    commonUses: ['烤肉腌制', '烤土豆', '面包烘焙', '橄榄油浸制', '汤品调味'],
    compatibleIngredients: ['羊肉', '牛肉', '鸡肉', '土豆', '面包', '橄榄油', '大蒜', '番茄'],
    pairingTaboos: ['海鲜（少量除外）', '清淡的蔬菜沙拉', '甜味菜肴'],
    cuisines: ['意餐', '法餐', '中餐', '地中海餐']
  },
  {
    id: 'flavor-003',
    spiceName: '孜然',
    category: '籽类',
    flavorProfile: '浓郁的烟熏香气，带有坚果味和淡淡的苦味，加热后香气更突出',
    commonUses: ['羊肉串腌制', '烧烤撒料', '咖喱调配', '炖肉增香', '炒制调料'],
    compatibleIngredients: ['羊肉', '牛肉', '鸡肉', '土豆', '洋葱', '辣椒', '鹰嘴豆', '胡萝卜'],
    pairingTaboos: ['海鲜类料理', '清淡的蒸菜', '甜品'],
    cuisines: ['中餐（西北）', '印度餐', '中东餐', '墨西哥餐']
  },
  {
    id: 'flavor-004',
    spiceName: '罗勒',
    category: '香草类',
    flavorProfile: '清新的甜香，带有丁香和薄荷的混合气息，新鲜使用最佳',
    commonUses: ['意面酱', '披萨调味', '青酱制作', '沙拉装饰', '汤品点缀'],
    compatibleIngredients: ['番茄', '马苏里拉奶酪', '意面', '橄榄油', '大蒜', '茄子', '鸡肉', '虾仁'],
    pairingTaboos: ['浓重的红烧菜品', '辛辣到盖过其香气的料理'],
    cuisines: ['意餐', '法餐', '泰餐', '中餐（创意菜）']
  },
  {
    id: 'flavor-005',
    spiceName: '牛至',
    category: '香草类',
    flavorProfile: '强烈的芳香，带有苦甜交织的味道，比马郁兰更浓郁',
    commonUses: ['披萨调味', '番茄酱', '烤肉腌制', '希腊沙拉', '炖菜增香'],
    compatibleIngredients: ['番茄', '羊肉', '牛肉', '鸡肉', '奶酪', '橄榄', '洋葱', '青椒'],
    pairingTaboos: ['清淡的鱼类料理', '甜点', '精致的法式点心'],
    cuisines: ['意餐', '希腊餐', '墨西哥餐', '中餐']
  },
  {
    id: 'flavor-006',
    spiceName: '百里香',
    category: '香草类',
    flavorProfile: '淡雅的草本清香，带有轻微的薄荷和柠檬气息，香气持久',
    commonUses: ['鸡汤调味', '烤肉腌料', '蔬菜烤制', '香草黄油', '炖肉增香'],
    compatibleIngredients: ['鸡肉', '牛肉', '羊肉', '鱼肉', '土豆', '蘑菇', '柠檬', '大蒜'],
    pairingTaboos: ['过量使用会发苦，不宜与过甜食材大量搭配'],
    cuisines: ['法餐', '意餐', '中餐', '地中海餐']
  },
  {
    id: 'flavor-007',
    spiceName: '辣椒粉',
    category: '辣椒类',
    flavorProfile: '鲜艳红色，带有辛辣刺激和微甜的烟熏风味，不同品种辣度差异大',
    commonUses: ['川菜调味', '烧烤撒料', '腌制泡菜', '红油制作', '炖菜增辣'],
    compatibleIngredients: ['猪肉', '牛肉', '鸡肉', '豆腐', '土豆', '白菜', '黄瓜', '花生'],
    pairingTaboos: ['清淡的粤菜点心', '日式怀石料理', '精致甜品'],
    cuisines: ['中餐（川菜）', '墨西哥餐', '印度餐', '韩餐']
  },
  {
    id: 'flavor-008',
    spiceName: '花椒',
    category: '辛香类',
    flavorProfile: '独特的麻酥感，带有柑橘般的清香和轻微的苦味，麻而不燥',
    commonUses: ['麻婆豆腐', '水煮鱼', '花椒油制作', '卤味增香', '烧烤撒料'],
    compatibleIngredients: ['牛肉', '鸡肉', '鱼肉', '豆腐', '土豆', '青椒', '豆角', '花生'],
    pairingTaboos: ['海鲜刺身类', '清淡的蒸菜', '甜食'],
    cuisines: ['中餐（川菜）', '韩餐', '日餐（少量）']
  },
  {
    id: 'flavor-009',
    spiceName: '八角',
    category: '花香类',
    flavorProfile: '浓郁的甘草般甜香，带有轻微的辛辣味，香气非常持久',
    commonUses: ['卤味制作', '红烧肉类', '五香调配', '煲汤提香', '腌制咸菜'],
    compatibleIngredients: ['猪肉', '牛肉', '鸡肉', '鸭肉', '鸡蛋', '豆腐', '花生', '海带'],
    pairingTaboos: ['清淡的鱼类料理', '凉拌菜', '甜食（除特殊糕点）'],
    cuisines: ['中餐', '越南餐', '印度餐', '东南亚餐']
  },
  {
    id: 'flavor-010',
    spiceName: '桂皮',
    category: '皮类',
    flavorProfile: '温暖的甜香，带有木质和轻微的辛辣感，常用于甜味和咸味料理',
    commonUses: ['红烧调味', '卤味增香', '肉桂卷', '苹果派', '热红酒', '奶茶调味'],
    compatibleIngredients: ['猪肉', '牛肉', '苹果', '梨', '巧克力', '蜂蜜', '坚果', '南瓜'],
    pairingTaboos: ['与大量醋搭配会变苦', '清淡的日式料理'],
    cuisines: ['中餐', '印度餐', '中东餐', '烘焙甜品']
  },
  {
    id: 'flavor-011',
    spiceName: '香叶',
    category: '叶类',
    flavorProfile: '淡雅的草本清香，带有轻微的木质香气，干品香气更浓郁',
    commonUses: ['汤品调味', '炖肉增香', '酱料制作', '腌卤调配', '意面酱'],
    compatibleIngredients: ['牛肉', '猪肉', '鸡肉', '番茄', '土豆', '胡萝卜', '洋葱', '豆类'],
    pairingTaboos: ['直接食用（需烹调后取出）', '清淡的冷盘'],
    cuisines: ['中餐', '意餐', '法餐', '地中海餐']
  },
  {
    id: 'flavor-012',
    spiceName: '姜黄',
    category: '根茎类',
    flavorProfile: '温暖的泥土气息，带有轻微的胡椒味和苦味，是咖喱的主要黄色来源',
    commonUses: ['咖喱制作', '炒饭调味', '腌制肉类', '黄金奶', '抗炎饮品'],
    compatibleIngredients: ['鸡肉', '羊肉', '鱼肉', '米饭', '土豆', '花椰菜', '椰奶', '菠菜'],
    pairingTaboos: ['生食刺激性较强', '清淡的清蒸料理'],
    cuisines: ['印度餐', '泰餐', '中东餐', '中餐（保健）']
  },
  {
    id: 'flavor-013',
    spiceName: '藏红花',
    category: '花香类',
    flavorProfile: '浓郁的蜂蜜般甜香，带有轻微的干草气息和独特的苦味，是最昂贵的香料之一',
    commonUses: ['西班牙海鲜饭', '烩饭调味', '糕点上色', '茶饮冲泡', '高端料理'],
    compatibleIngredients: ['米饭', '海鲜', '鸡肉', '杏仁', '蜂蜜', '牛奶', '玫瑰', '开心果'],
    pairingTaboos: ['与其他浓烈香料大量搭配会掩盖其香气', '廉价料理'],
    cuisines: ['西班牙餐', '印度餐', '波斯餐', '地中海餐']
  },
  {
    id: 'flavor-014',
    spiceName: '香菜籽',
    category: '籽类',
    flavorProfile: '清新的柠檬般甜香，带有轻微的胡椒和鼠尾草气息，磨碎后香气更佳',
    commonUses: ['咖喱调配', '腌制肉类', '面包烘焙', '汤品增香', '自制香肠'],
    compatibleIngredients: ['猪肉', '牛肉', '鸡肉', '鱼肉', '面包', '豆类', '土豆', '胡萝卜'],
    pairingTaboos: ['甜品（少量除外）', '极清淡的日式料理'],
    cuisines: ['印度餐', '中东餐', '墨西哥餐', '中餐']
  },
  {
    id: 'flavor-015',
    spiceName: '肉豆蔻',
    category: '籽类',
    flavorProfile: '温暖的甜香，带有坚果和轻微的樟脑气息，磨碎后立即使用最佳',
    commonUses: ['白酱调味', '蛋奶酒', '烘焙糕点', '土豆泥增香', '肉类腌制'],
    compatibleIngredients: ['奶油', '牛奶', '奶酪', '鸡蛋', '土豆', '菠菜', '南瓜', '巧克力'],
    pairingTaboos: ['过量使用有麻醉感', '与酸味过重食材搭配'],
    cuisines: ['法餐', '意餐', '印度餐', '烘焙甜品']
  }
];

export default flavorKnowledgeData;
