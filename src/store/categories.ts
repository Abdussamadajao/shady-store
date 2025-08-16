import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriesState {
  categories: Category[];
  activeCategories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CategoriesActions {
  // Category management
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;

  // Category selection
  setSelectedCategory: (categoryId: string | null) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed actions
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByParent: (parentId: string) => Category[];
  getRootCategories: () => Category[];
  getCategoryPath: (categoryId: string) => Category[];
  getCategoryTree: () => CategoryTree[];
  updateProductCount: (categoryId: string, count: number) => void;
}

interface CategoryTree extends Category {
  children: CategoryTree[];
}

type CategoriesStore = CategoriesState & CategoriesActions;

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      activeCategories: [],
      selectedCategory: null,
      isLoading: false,
      error: null,

      // Category management
      setCategories: (categories) => {
        const activeCategories = categories.filter((cat) => cat.isActive);
        set({ categories, activeCategories });
      },

      addCategory: (category) => {
        const { categories } = get();
        const newCategories = [...categories, category];
        const activeCategories = newCategories.filter((cat) => cat.isActive);
        set({ categories: newCategories, activeCategories });
      },

      updateCategory: (id, updates) => {
        const { categories } = get();
        const updatedCategories = categories.map((category) =>
          category.id === id ? { ...category, ...updates } : category
        );
        const activeCategories = updatedCategories.filter(
          (cat) => cat.isActive
        );
        set({ categories: updatedCategories, activeCategories });
      },

      removeCategory: (id) => {
        const { categories } = get();
        const filteredCategories = categories.filter(
          (category) => category.id !== id
        );
        const activeCategories = filteredCategories.filter(
          (cat) => cat.isActive
        );
        set({ categories: filteredCategories, activeCategories });
      },

      // Category selection
      setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
      },

      // State management
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Computed actions
      getCategoryById: (id) => {
        const { categories } = get();
        return categories.find((category) => category.id === id);
      },

      getCategoriesByParent: (parentId) => {
        const { categories } = get();
        return categories.filter((category) => category.parentId === parentId);
      },

      getRootCategories: () => {
        const { categories } = get();
        return categories.filter((category) => !category.parentId);
      },

      getCategoryPath: (categoryId) => {
        const { categories } = get();
        const path: Category[] = [];
        let currentId = categoryId;

        while (currentId) {
          const category = categories.find((cat) => cat.id === currentId);
          if (category) {
            path.unshift(category);
            currentId = category.parentId || "";
          } else {
            break;
          }
        }

        return path;
      },

      getCategoryTree: () => {
        const { categories } = get();
        const buildTree = (parentId?: string): CategoryTree[] => {
          return categories
            .filter((cat) => cat.parentId === parentId)
            .map((cat) => ({
              ...cat,
              children: buildTree(cat.id),
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder);
        };

        return buildTree();
      },

      updateProductCount: (categoryId, count) => {
        const { categories } = get();
        const updatedCategories = categories.map((category) =>
          category.id === categoryId
            ? { ...category, productCount: count }
            : category
        );
        const activeCategories = updatedCategories.filter(
          (cat) => cat.isActive
        );
        set({ categories: updatedCategories, activeCategories });
      },
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);

// Selector hooks for better performance
export const useCategories = () =>
  useCategoriesStore((state) => state.categories);
export const useActiveCategories = () =>
  useCategoriesStore((state) => state.activeCategories);
export const useSelectedCategory = () =>
  useCategoriesStore((state) => state.selectedCategory);
export const useCategoriesLoading = () =>
  useCategoriesStore((state) => state.isLoading);
export const useCategoriesError = () =>
  useCategoriesStore((state) => state.error);
