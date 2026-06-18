import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Favorite, FavoriteType } from '../types';

interface FavoriteState {
  favorites: Favorite[];
  addFavorite: (type: FavoriteType, itemId: string, itemData: Record<string, unknown>) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (type: FavoriteType, itemId: string, itemData: Record<string, unknown>) => boolean;
  isFavorite: (type: FavoriteType, itemId: string) => boolean;
  getFavoritesByType: (type: FavoriteType) => Favorite[];
  getFavoriteItemIds: (type: FavoriteType) => string[];
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (type, itemId, itemData) => {
        const newFavorite: Favorite = {
          id: `fav-${Date.now()}`,
          type,
          itemId,
          itemData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          favorites: [...state.favorites, newFavorite],
        }));
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      toggleFavorite: (type, itemId, itemData) => {
        const existing = get().favorites.find(
          (f) => f.type === type && f.itemId === itemId
        );

        if (existing) {
          set((state) => ({
            favorites: state.favorites.filter((f) => f.id !== existing.id),
          }));
          return false;
        } else {
          const newFavorite: Favorite = {
            id: `fav-${Date.now()}`,
            type,
            itemId,
            itemData,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            favorites: [...state.favorites, newFavorite],
          }));
          return true;
        }
      },

      isFavorite: (type, itemId) => {
        return get().favorites.some(
          (f) => f.type === type && f.itemId === itemId
        );
      },

      getFavoritesByType: (type) => {
        return get()
          .favorites.filter((f) => f.type === type)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getFavoriteItemIds: (type) => {
        return get()
          .favorites.filter((f) => f.type === type)
          .map((f) => f.itemId);
      },
    }),
    {
      name: 'spice-rack-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFavoriteStore;
