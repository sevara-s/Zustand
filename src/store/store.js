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
        if (get().tasks.length > 0) return;  

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

      add: async (taskName) => {
        const newTask = { name: taskName, completed: false };
      
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
          });
      
          if (!response.ok) throw new Error("Failed to add task");
      
          const savedTask = await response.json();  
      
          set((state) => ({
            tasks: [...state.tasks, savedTask],  
            searchQuery: "",  
          }));
      
        } catch (error) {
          console.error("Add task error:", error);
        }
      },
      
      
      
      
      toggleTask: async (id) => {
        const tasks = get().tasks;
        const taskToToggle = tasks.find((task) => task.id === id);
        if (!taskToToggle) return;

        const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

        try {
          const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
          });

          if (!response.ok) throw new Error("Failed to update task");

          set({
            tasks: tasks.map((task) => (task.id === id ? updatedTask : task)),
          });
        } catch (error) {
          console.error("Toggle task error:", error);
        }
      },

      editTask: async (updatedTask) => {
        try {
          const response = await fetch(`${API_URL}/${updatedTask.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
          });
      
          if (!response.ok) throw new Error("Failed to edit task");
      
          // Log the task being updated
          console.log("Task updated in the store:", updatedTask);
      
          // Update the task in the state directly
          set({
            tasks: get().tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          });
      
        } catch (error) {
          console.error("Edit task error:", error);
        }
      },
      
      
      

      deleteTask: async (id) => {
        try {
          const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
          if (!response.ok) throw new Error("Failed to delete task");
      
          set({
            tasks: get().tasks.filter((task) => task.id !== id),
          });
          console.log(`Task with id ${id} deleted successfully`);
        } catch (error) {
          console.error("Delete task error:", error);
        }
      },
      

      updateSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
