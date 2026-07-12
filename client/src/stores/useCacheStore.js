import { create } from "zustand";

export const useCacheStore = create((set) => ({
  // Cached data
  modules: null,
  subjects: null,
  
  // Topics cached by subjectKey (e.g., { "math-101": [...] })
  topicsBySubject: {},
  allTopics: null,

  // Setters
  setModules: (modules) => set({ modules }),
  setSubjects: (subjects) => set({ subjects }),
  setAllTopics: (allTopics) => set({ allTopics }),
  setTopicsForSubject: (subjectKey, topics) =>
    set((state) => ({
      topicsBySubject: {
        ...state.topicsBySubject,
        [subjectKey]: topics,
      },
      allTopics: null,
    })),

  // Invalidators
  invalidateModules: () => set({ modules: null }),
  invalidateSubjects: () => set({ subjects: null }),
  invalidateTopicsForSubject: (subjectKey) =>
    set((state) => {
      const newTopics = { ...state.topicsBySubject };
      delete newTopics[subjectKey];
      return { topicsBySubject: newTopics, allTopics: null };
    }),
  invalidateAllTopics: () => set({ topicsBySubject: {}, allTopics: null }),
  
  // Clear all cache
  clearCache: () =>
    set({
      modules: null,
      subjects: null,
      topicsBySubject: {},
      allTopics: null,
    }),
}));
