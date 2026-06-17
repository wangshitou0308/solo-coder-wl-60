import type { ClassicPairing } from '../types';

export const classicPairingsData: ClassicPairing[] = [
  {
    id: 'pairing-001',
    name: '经典牛肉香料',
    targetIngredient: '牛肉',
    spices: [
      { name: '黑胡椒', amount: '1茶匙' },
      { name: '迷迭香', amount: '1/2茶匙' },
      { name: '百里香', amount: '1/2茶匙' }
    ],
    description: '经典的牛排组合，黑胡椒的辛辣与迷迭香的松木香气完美衬托牛肉的鲜美，百里香增添淡雅草本层次，适合煎、烤、炖等多种烹饪方式。',
    cuisineType: '西餐'
  },
  {
    id: 'pairing-002',
    name: '孜然羊肉',
    targetIngredient: '羊肉',
    spices: [
      { name: '孜然', amount: '1汤匙' },
      { name: '辣椒粉', amount: '1茶匙' },
      { name: '花椒', amount: '1/2茶匙' }
    ],
    description: '西北风味的灵魂搭配，孜然的烟熏香气去腥增香，辣椒粉增添辛辣刺激，花椒带来独特麻酥感，是羊肉串和手抓肉的必备组合。',
    cuisineType: '中餐'
  },
  {
    id: 'pairing-003',
    name: '意式番茄',
    targetIngredient: '番茄',
    spices: [
      { name: '罗勒', amount: '1汤匙' },
      { name: '牛至', amount: '1茶匙' },
      { name: '百里香', amount: '1/2茶匙' }
    ],
    description: '意式经典，罗勒的清甜与牛至的浓郁芳香赋予番茄料理地中海风情，百里香平衡整体风味，是意面、披萨和番茄酱的黄金搭配。',
    cuisineType: '意餐'
  },
  {
    id: 'pairing-004',
    name: '法式香草鸡',
    targetIngredient: '鸡肉',
    spices: [
      { name: '百里香', amount: '1茶匙' },
      { name: '迷迭香', amount: '1/2茶匙' },
      { name: '黑胡椒', amount: '1/2茶匙' }
    ],
    description: '法式清新组合，百里香的淡雅草本香与迷迭香的松木气息相得益彰，黑胡椒提味，让烤鸡和煎鸡胸肉更加鲜嫩多汁。',
    cuisineType: '法餐'
  },
  {
    id: 'pairing-005',
    name: '五香卤肉',
    targetIngredient: '猪肉',
    spices: [
      { name: '八角', amount: '3颗' },
      { name: '桂皮', amount: '1小块' },
      { name: '香叶', amount: '3片' }
    ],
    description: '中式卤味的核心配方，八角的甘草甜香、桂皮的温暖香气与香叶的淡雅清香完美融合，赋予红烧肉、卤猪肉浓郁醇厚的风味。',
    cuisineType: '中餐'
  },
  {
    id: 'pairing-006',
    name: '印度咖喱海鲜',
    targetIngredient: '海鲜',
    spices: [
      { name: '姜黄', amount: '1茶匙' },
      { name: '香菜籽', amount: '1茶匙' },
      { name: '孜然', amount: '1/2茶匙' }
    ],
    description: '印度风味，姜黄的泥土香气赋予海鲜金黄色泽，香菜籽的柠檬清香和孜然的烟熏味带来异域色彩，适合咖喱海鲜和香煎鱼块。',
    cuisineType: '印度餐'
  },
  {
    id: 'pairing-007',
    name: '地中海烤土豆',
    targetIngredient: '土豆',
    spices: [
      { name: '迷迭香', amount: '1茶匙' },
      { name: '牛至', amount: '1/2茶匙' },
      { name: '黑胡椒', amount: '1/2茶匙' }
    ],
    description: '地中海家常菜，迷迭香的草本清香与牛至的浓郁风味让烤土豆外酥里嫩，黑胡椒增添辛辣层次，香气四溢。',
    cuisineType: '意餐'
  },
  {
    id: 'pairing-008',
    name: '香草炒蛋',
    targetIngredient: '鸡蛋',
    spices: [
      { name: '黑胡椒', amount: '1/4茶匙' },
      { name: '百里香', amount: '1/4茶匙' },
      { name: '辣椒粉', amount: '少许' }
    ],
    description: '早餐经典组合，黑胡椒的微辣和百里香的清香让炒蛋、煎蛋和蛋饼风味更上一层楼，辣椒粉可选增添微辣口感。',
    cuisineType: '西餐'
  },
  {
    id: 'pairing-009',
    name: '泰式冬阴功',
    targetIngredient: '虾',
    spices: [
      { name: '辣椒粉', amount: '1茶匙' },
      { name: '姜黄', amount: '1/2茶匙' },
      { name: '香菜籽', amount: '1/2茶匙' }
    ],
    description: '泰国国汤风味，辣椒粉带来热辣刺激，姜黄增添温暖底色，香菜籽的柠檬清香与酸辣汤底完美融合，虾肉鲜嫩入味。',
    cuisineType: '泰国餐'
  },
  {
    id: 'pairing-010',
    name: '墨西哥塔可',
    targetIngredient: '牛肉馅',
    spices: [
      { name: '辣椒粉', amount: '1汤匙' },
      { name: '孜然', amount: '1茶匙' },
      { name: '牛至', amount: '1/2茶匙' }
    ],
    description: '墨西哥塔可灵魂调味，辣椒粉的热辣、孜然的烟熏与牛至的芳香组合，赋予牛肉馅浓郁的拉美风情，夹入玉米饼风味绝佳。',
    cuisineType: '墨西哥餐'
  },
  {
    id: 'pairing-011',
    name: '藏红花烩饭',
    targetIngredient: '米饭',
    spices: [
      { name: '藏红花', amount: '少许（约20根）' },
      { name: '桂皮', amount: '1小块' },
      { name: '肉豆蔻', amount: '1/4茶匙' }
    ],
    description: '西班牙和波斯风味，藏红花赋予米饭金黄色泽和独特甜香，桂皮增添温暖层次，肉豆蔻带来坚果甜香，是海鲜饭的灵魂。',
    cuisineType: '法餐'
  },
  {
    id: 'pairing-012',
    name: '玛莎拉咖喱鸡',
    targetIngredient: '鸡腿肉',
    spices: [
      { name: '姜黄', amount: '1茶匙' },
      { name: '孜然', amount: '1茶匙' },
      { name: '香菜籽', amount: '1茶匙' },
      { name: '辣椒粉', amount: '1/2茶匙' },
      { name: '肉豆蔻', amount: '1/4茶匙' }
    ],
    description: '印度经典玛莎拉风味，姜黄、孜然、香菜籽三大核心香料打底，辣椒粉增添辣度，肉豆蔻提升甜香层次，鸡肉裹满浓郁酱汁。',
    cuisineType: '印度餐'
  }
];

export default classicPairingsData;
