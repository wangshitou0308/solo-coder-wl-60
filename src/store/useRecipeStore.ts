import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CustomRecipe, RecipeComponent } from '../types';

const curryComponents: RecipeComponent[] = [
  { spiceId: 'spice-012', spiceName: '姜黄', ratio: 30 },
  { spiceId: 'spice-003', spiceName: '孜然', ratio: 20 },
  { spiceId: 'spice-001', spiceName: '芫荽籽', ratio: 15 },
  { spiceId: 'spice-007', spiceName: '辣椒粉', ratio: 10 },
  { spiceId: 'spice-009', spiceName: '八角', ratio: 10 },
  { spiceId: 'spice-010', spiceName: '桂皮', ratio: 8 },
  { spiceId: 'spice-011', spiceName: '香叶', ratio: 7 },
];

const fiveSpiceComponents: RecipeComponent[] = [
  { spiceId: 'spice-009', spiceName: '八角', ratio: 25 },
  { spiceId: 'spice-010', spiceName: '桂皮', ratio: 20 },
  { spiceId: 'spice-008', spiceName: '花椒', ratio: 18 },
  { spiceId: 'spice-011', spiceName: '香叶', ratio: 15 },
  { spiceId: 'spice-003', spiceName: '小茴香', ratio: 12 },
  { spiceId: 'spice-002', spiceName: '丁香', ratio: 10 },
];

const mockRecipes: CustomRecipe[] = [
  {
    id: 'recipe-001',
    name: '印度咖喱粉',
    description: '经典印度风味咖喱粉配方，香气浓郁层次丰富，适合各种咖喱类菜肴',
    suitableDishes: ['咖喱鸡', '咖喱牛肉', '蔬菜咖喱', '咖喱饭'],
    components: curryComponents,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-05-20T10:30:00.000Z',
  },
  {
    id: 'recipe-002',
    name: '中式五香粉',
    description: '传统中式五香粉配方，适合卤味、烧烤、炒菜均可使用',
    suitableDishes: ['红烧肉', '五香牛肉', '卤蛋', '烧烤腌料', '包子饺子馅'],
    components: fiveSpiceComponents,
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-04-10T09:15:00.000Z',
  },
];

interface RecipeState {
  recipes: CustomRecipe[];
  addRecipe: (recipe: Omit<CustomRecipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, updates: Partial<CustomRecipe>) => void;
  deleteRecipe: (id: string) => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      recipes: mockRecipes,
      addRecipe: (recipe) =>
        set((state) => {
          const now = new Date().toISOString();
          const newRecipe: CustomRecipe = {
            ...recipe,
            id: `recipe-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };
          return { recipes: [...state.recipes, newRecipe] };
        }),
      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        })),
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'spice-rack-recipes',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecipeStore;
