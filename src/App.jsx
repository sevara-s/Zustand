import React, { useEffect } from 'react';
import { Spin } from 'antd';
import ProgressBar from './components/progressbar';
import TaskInput from './components/taskInput';
import TaskList from './components/taskList';
import { useTodoStore } from './store/store';

function App() {
  const { fetchTasks, loading, error } = useTodoStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (error) {
    return (
      <div className="p-4 max-w-lg mx-auto mt-[40px] text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto border-2 border-[#e6ccb2] mt-[40px] bg-[#e6ccb2] rounded-4xl">
      
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <ProgressBar />
            <TaskInput />
            <TaskList />
          </>
        )}
    
    </div>
  );
}

export default App;