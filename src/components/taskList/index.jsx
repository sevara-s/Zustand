import React, { useState, useMemo, useEffect } from "react";
import { Button, Spin } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Edit from "../edit";
import { useTodoStore } from "../../store/store";

const TaskList = () => {
  const { toggleTask, deleteTask, fetchTasks, loading, searchQuery, tasks } =
    useTodoStore();
  const [edited, setEdited] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return <div className="text-center text-lg">No tasks available</div>;
  }

  return (
    <div className="mt-4">
      {tasks.map((task) => (
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
            {task.name}
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
