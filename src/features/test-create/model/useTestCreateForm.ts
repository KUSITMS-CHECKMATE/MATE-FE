import { create } from 'zustand';
import type { TestCreateFormData, QuestionTypeId, PendingQuestion, QuestionData } from './types';
import { MAX_CATEGORIES, type CategoryId } from './types';

export interface TestCreateFormStore extends TestCreateFormData {
  questions: PendingQuestion[];
  setName: (name: string) => void;
  setSummary: (summary: string) => void;
  setDescription: (description: string) => void;
  setServiceName: (serviceName: string) => void;
  setCategories: (categories: CategoryId[]) => void;
  toggleCategory: (category: CategoryId) => void;
  setImages: (images: string[]) => void;
  addQuestions: (typeIds: QuestionTypeId[]) => void;
  updateQuestion: (id: string, data: QuestionData) => void;
  removeQuestion: (id: string) => void;
  reorderQuestions: (questions: PendingQuestion[]) => void;
  reset: () => void;
}

const initialState: TestCreateFormData & { questions: PendingQuestion[] } = {
  name: '',
  summary: '',
  description: '',
  serviceName: '',
  categories: [],
  images: [],
  questions: [],
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
  addQuestions: (typeIds) =>
    set((state) => ({
      questions: [
        ...state.questions,
        ...typeIds.map((typeId) => ({
          id: `${typeId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          typeId,
        })),
      ],
    })),
  updateQuestion: (id, data) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, data } : q)),
    })),
  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  reorderQuestions: (questions) => set({ questions }),
  reset: () => set(initialState),
}));
