import { create } from 'zustand';
import type { TestCreateFormData } from './types';
import { MAX_CATEGORIES, type CategoryId } from './types';

export interface TestCreateFormStore extends TestCreateFormData {
  setName: (name: string) => void;
  setSummary: (summary: string) => void;
  setDescription: (description: string) => void;
  setServiceName: (serviceName: string) => void;
  setCategories: (categories: CategoryId[]) => void;
  toggleCategory: (category: CategoryId) => void;
  setImages: (images: string[]) => void;
  reset: () => void;
}

const initialState: TestCreateFormData = {
  name: '',
  summary: '',
  description: '',
  serviceName: '',
  categories: [],
  images: [],
};

export const useTestCreateForm = create<TestCreateFormStore>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setSummary: (summary) => set({ summary }),
  setDescription: (description) => set({ description }),
  setServiceName: (serviceName) => set({ serviceName }),
  setCategories: (categories) => set({ categories }),
  setImages: (images) => set({ images }),
  toggleCategory: (category) =>
    set((state) => {
      const isSelected = state.categories.includes(category);
      if (isSelected) {
        return { categories: state.categories.filter((c) => c !== category) };
      }
      if (state.categories.length >= MAX_CATEGORIES) {
        return state;
      }
      return { categories: [...state.categories, category] };
    }),
  reset: () => set(initialState),
}));
