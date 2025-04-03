import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_URL = "https://67b04cd6dffcd88a6788d8b6.mockapi.io/todo";

export const useTodoStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: "",
      loading: false,
      error: null,

      fetchTasks: async () => {
        const { tasks } = get(); 
        if (tasks.length > 0) return;  
        
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

      add: (task) => {
        const newTask = {
          id: Date.now().toString(),   
          name: task,
          completed: false,
        };
        const tasks = get().tasks;
        set({ tasks: [...tasks, newTask] });
      },

      updateSearchQuery: (query) => set({ searchQuery: query }),

      toggleTask: (id) => {
        const tasks = get().tasks;
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        set({ tasks: updatedTasks });
      },

      deleteTask: (id) => {
        const tasks = get().tasks.filter((task) => task.id !== id);
        set({ tasks });
      },

      editTask: (updatedTask) => {
        const tasks = get().tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        set({ tasks });
      },

      search: (query) => set({ searchQuery: query }),
    }),
    {
      name: "todo-storage",  
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),  
    }
  )
);
