import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useTodoStore } from "../../store/store";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const [searching, setSearching] = useState(false);
  const searchQuery = useTodoStore(state => state.searchQuery);
  const add = useTodoStore(state => state.add);
  const search = useTodoStore(state => state.search);

  const handleAdd = () => {
    if (task.trim()) {
      add(task);
      setTask("");
    }
  };

  return (
    <div className="flex gap-2 items-center mb-4">
      <Input
        className="!rounded-2xl !p-[10px] !bg-[#eddcd2] !outline-none"
        placeholder={searching ? "Search task" : "Add new task"}
        value={searching ? searchQuery : task}
        onChange={(e) =>
          searching
            ? search(e.target.value)
            : setTask(e.target.value)
        }
        onPressEnter={!searching ? handleAdd : null}
      />
      
      <SearchOutlined
        className="cursor-pointer text-[#655a4f] hover:text-[#443531] text-lg"
        onClick={() => {
          setSearching(!searching);
          if (searching) search("");
        }}
      />
    
      {!searching && (
        <button
          className="bg-[#9d6b53] text-white px-3 py-1 rounded-lg hover:bg-[#7a5340]"
          onClick={handleAdd}
        >
          <PlusOutlined />
        </button>
      )}
    </div>
  );
};

export default TaskInput;