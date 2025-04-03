import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Edit from '../edit';
import { useTasks, useSearchQuery, useTodoActions } from '../../store/store';

const TaskList = () => {
  const tasks = useTasks();
  const searchQuery = useSearchQuery();
  const { toggleTask, deleteTask, fetchTasks } = useTodoActions();
  const [edited, setEdited] = useState(null);

  // Fetch tasks only once when the component is mounted
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Avoid infinite loop by only running once

  // Memoize filtered tasks to avoid unnecessary recalculations
  const filteredTasks = useMemo(() => {
    const query = searchQuery?.toLowerCase() || '';
    return tasks.filter(task => 
      task?.text?.toLowerCase()?.includes(query)
    );
  }, [tasks, searchQuery]);

  if (tasks.length === 0) return <div>Loading tasks...</div>;

  return (
    <div className="mt-4">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center border rounded-2xl border-[#9d6b53] p-2 my-2"
        >
          <span
            className={`cursor-pointer ${
              task.completed ? "line-through text-[#a98467]" : "text-[#432818]"
            }`}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </span>
          <div className="flex gap-2">
            <Button 
              className="!text-[#9d6b53]" 
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? "Done" : "Active"}
            </Button>
            <Button 
              icon={<EditOutlined className="!text-[#9d6b53]" />} 
              onClick={() => setEdited(task)} 
            />
            <Button
              icon={<DeleteOutlined className="!text-[#9d6b53]" />}
              onClick={() => deleteTask(task.id)}
            />
          </div>
        </div>
      ))}
      {edited && <Edit task={edited} close={() => setEdited(null)} />}
    </div>
  );
};

export default TaskList;
