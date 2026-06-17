import type { CuisineConfig } from '../types';

export const cuisineConfigsData: CuisineConfig[] = [
  {
    id: 'cuisine-001',
    name: '中餐',
    icon: '🥢',
    coreSpices: ['八角', '桂皮', '花椒', '香叶', '辣椒粉', '孜然', '姜黄'],
    representativeDishes: ['红烧肉', '麻婆豆腐', '水煮鱼', '卤味拼盘', '烤羊肉串'],
    description: '博大精深的中华料理，川菜以麻辣鲜香著称，粤菜讲究原汁原味，鲁菜擅长煨炖，各大菜系各有特色。'
  },
  {
    id: 'cuisine-002',
    name: '法餐',
    icon: '🥐',
    coreSpices: ['百里香', '迷迭香', '罗勒', '黑胡椒', '肉豆蔻', '香叶'],
    representativeDishes: ['法式洋葱汤', '红酒炖牛肉', '香草烤鸡', '奶油蘑菇汤', '可丽饼'],
    description: '精致优雅的法式料理，注重食材本味与酱汁的完美融合，香草的运用是法餐的灵魂。'
  },
  {
    id: 'cuisine-003',
    name: '意餐',
    icon: '🍝',
    coreSpices: ['罗勒', '牛至', '迷迭香', '黑胡椒', '香叶', '百里香'],
    representativeDishes: ['玛格丽特披萨', '意式肉酱面', '青酱意面', '提拉米苏', '卡布里沙拉'],
    description: '热情浪漫的意大利料理，以面食、披萨和海鲜闻名，番茄与香草的组合是永恒的经典。'
  },
  {
    id: 'cuisine-004',
    name: '印度餐',
    icon: '🍛',
    coreSpices: ['姜黄', '孜然', '香菜籽', '辣椒粉', '桂皮', '肉豆蔻', '藏红花'],
    representativeDishes: ['咖喱鸡', '比尔亚尼焖饭', '玛莎拉茶', '印度飞饼', '坦都里烤鸡'],
    description: '丰富多彩的印度料理，香料的运用登峰造极，咖喱的变化无穷无尽，每一口都是味蕾的冒险。'
  },
  {
    id: 'cuisine-005',
    name: '泰国餐',
    icon: '🍜',
    coreSpices: ['辣椒粉', '姜黄', '罗勒', '香菜籽', '孜然', '桂皮'],
    representativeDishes: ['冬阴功汤', '泰式咖喱', '青木瓜沙拉', '泰式炒河粉', '芒果糯米饭'],
    description: '酸辣鲜香的泰国料理，完美平衡酸、辣、甜、咸、苦五味，香茅和柠檬叶的加入带来独特风味。'
  },
  {
    id: 'cuisine-006',
    name: '墨西哥餐',
    icon: '🌮',
    coreSpices: ['辣椒粉', '孜然', '牛至', '香菜籽', '黑胡椒', '桂皮'],
    representativeDishes: ['墨西哥玉米卷', '墨西哥夹饼', '鳄梨酱', '墨西哥辣椒炖肉', '玉米片配莎莎酱'],
    description: '热情奔放的墨西哥料理，以玉米、辣椒和豆类为基础，口味浓烈刺激，充满异域风情。'
  }
];

export default cuisineConfigsData;
