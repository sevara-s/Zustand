import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_URL = "https://67b04cd6dffcd88a6788d8b6.mockapi.io/todo";

export const useTodoStore = create(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      searchQuery: "",
      loading: false,
      error: null,

      // Actions
      fetchTasks: async () => {
        const { tasks } = get(); // Prevent fetching if already fetched
        if (tasks.length > 0) return; // Do nothing if tasks are already loaded

        set({ loading: true, error: null });
        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Failed to fetch tasks");
          const tasks = await response.json();
          set({ tasks, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error("Fetch error:", error);
        }
      },

      // Search query update action
      updateSearchQuery: (query) => set({ searchQuery: query }),

      // Task toggle action (mark task as completed or active)
      toggleTask: (id) => {
        const tasks = get().tasks;
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        set({ tasks: updatedTasks });
      },

      // Task delete action
      deleteTask: (id) => {
        const tasks = get().tasks.filter((task) => task.id !== id);
        set({ tasks });
      },

      // Task edit action
      editTask: (updatedTask) => {
        const tasks = get().tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        set({ tasks });
      },
    }),
    {
      name: "todo-storage", // Key to persist in storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }), // Only persist tasks
    }
  )
);

// Selectors
export const useTasks = () => useTodoStore((state) => state.tasks);
export const useSearchQuery = () => useTodoStore((state) => state.searchQuery);
export const useLoading = () => useTodoStore((state) => state.loading);
export const useTodoActions = () =>
  useTodoStore((state) => ({
    fetchTasks: state.fetchTasks,
    updateSearchQuery: state.updateSearchQuery,
    toggleTask: state.toggleTask,
    deleteTask: state.deleteTask,
    editTask: state.editTask,
  }));

export default useTodoStore;
