import { Progress } from "antd";
import useTodoStore from "../../store/store";  


const ProgressBar = () => {
  const tasks = useTodoStore((state) => state.tasks);
  
  const completed = tasks.filter((task) => task.completed).length;
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="w-full px-4 py-2">
      <h1 className="font-bold text-[30px] text-[#443531]">Your progress</h1>
      <Progress
        percent={percent}
        strokeColor={{ "0%": "#a98467", "100%": "#a98467" }}
        showInfo={true}
        size="large"
        className="rounded-xl transition-all duration-300 ease-in-out"
      />
    </div>
  );
};

export default ProgressBar;