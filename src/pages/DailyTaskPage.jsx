import { useEffect, useState } from "react";
import { getTodayTasks, completeTask } from "../services/dailyTaskService";
import { useNavigate } from "react-router-dom";

function DailyTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load existing tasks from database
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);

      // Only get existing tasks
      const userId = localStorage.getItem("userId") || "1";
      const response = await getTodayTasks(userId);

      setTasks(response.tasks || []);
    } catch (error) {
      console.error("Failed to load daily tasks:", error);

      alert("Failed to load Daily Tasks");
    } finally {
      setLoading(false);
    }
  };

  // Complete task
  const markCompleted = async (taskId) => {
    try {
      await completeTask(taskId);

      // Reload tasks to show updated status
      await loadTasks();
    } catch (error) {
      console.error("Failed to complete task:", error);

      alert("Failed to complete task");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Today's AI Daily Tasks</h1>

      {loading ? (
        <h3>Loading...</h3>
      ) : tasks.length === 0 ? (
        <div>
          <h3>No daily tasks available.</h3>

          <p>Please generate your career roadmap first.</p>

          <button onClick={() => navigate("/roadmap")}>Go to Roadmap</button>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ccc",
                marginBottom: "15px",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>Day {task.day}</h3>

              <p>{task.task}</p>

              <p>Status: {task.status ? "✅ Completed" : "❌ Pending"}</p>

              {!task.status && (
                <button onClick={() => markCompleted(task.id)}>Complete</button>
              )}
            </div>
          ))}

          <br />

          <button onClick={() => navigate("/interview")}>
            Continue to Mock Interview →
          </button>
        </>
      )}
    </div>
  );
}

export default DailyTaskPage;
