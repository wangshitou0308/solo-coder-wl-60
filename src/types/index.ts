export type SpiceCategory =
  | '香草类'
  | '辛香类'
  | '辣椒类'
  | '花香类'
  | '籽类'
  | '根茎类'
  | '混合类'
  | '皮类'
  | '叶类';

export type SpiceForm =
  | '整粒'
  | '粉末'
  | '新鲜'
  | '干燥'
  | '油浸'
  | '膏状'
  | '碎片';

export type SeasonType = '春季' | '夏季' | '秋季' | '冬季';

export type SpiceUnit = '克' | '毫升' | '个' | '片' | '茶匙' | '汤匙' | '束' | '小块';

export type InventoryLogType = 'restock' | 'open' | 'consume' | 'adjust' | 'purchase';

export type ShoppingPriority = 'urgent' | 'soon' | 'optional';

export type FlavorTag = '麻辣' | '草本' | '烟熏' | '甜香' | '咖喱' | '卤味' | '香辣' | '清新' | '浓郁';

export type FavoriteType = 'pairing' | 'challenge' | 'dish';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Spice {
  id: string;
  name: string;
  category: SpiceCategory;
  form: SpiceForm;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  openDate?: string;
  storageLocation: string;
  remainingAmount: number;
  minThreshold: number;
  fullAmount: number;
  unit: SpiceUnit;
  photoUrl?: string;
  notes?: string;
  isSeasonal?: boolean;
  seasonType?: SeasonType;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  spiceId: string;
  spiceName: string;
  type: InventoryLogType;
  amount: number;
  unit: string;
  remainingAfter: number;
  note?: string;
  relatedRecordId?: string;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  spiceId: string;
  spiceName: string;
  suggestedAmount: number;
  unit: string;
  priority: ShoppingPriority;
  reason: string;
  addedManually: boolean;
  checked: boolean;
  category?: SpiceCategory;
  brand?: string;
  storageLocation?: string;
  createdAt: string;
}

export interface DishSuggestion {
  id: string;
  name: string;
  description: string;
  flavorTags: FlavorTag[];
  ingredients: string[];
  requiredSpices: { name: string; amount: string; category?: SpiceCategory }[];
  cuisineType: string;
  difficulty: DifficultyLevel;
  cookTime?: string;
}

export interface Favorite {
  id: string;
  type: FavoriteType;
  itemId: string;
  itemData: Record<string, unknown>;
  createdAt: string;
}

export interface FlavorKnowledge {
  id: string;
  spiceName: string;
  category: SpiceCategory;
  flavorProfile: string;
  commonUses: string[];
  compatibleIngredients: string[];
  pairingTaboos: string[];
  cuisines: string[];
}

export interface ClassicPairing {
  id: string;
  name: string;
  targetIngredient: string;
  spices: { name: string; amount: string }[];
  description: string;
  cuisineType: string;
}

export interface SpiceUsage {
  spiceId: string;
  spiceName: string;
  amount: number;
  unit: string;
}

export interface CookingRecord {
  id: string;
  dishName: string;
  cookDate: string;
  ingredients: string[];
  usages: SpiceUsage[];
  flavorRating: number;
  notes?: string;
  createdAt: string;
}

export interface RecipeComponent {
  spiceId: string;
  spiceName: string;
  ratio: number;
}

export interface CustomRecipe {
  id: string;
  name: string;
  description: string;
  suitableDishes: string[];
  components: RecipeComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface CuisineConfig {
  id: string;
  name: string;
  icon: string;
  coreSpices: string[];
  representativeDishes: string[];
  description: string;
}

export type ExpiryStatus = 'expired' | 'urgent' | 'soon' | 'normal';

export interface ExpiryStatusResult {
  status: ExpiryStatus;
  days: number;
  color: string;
}
