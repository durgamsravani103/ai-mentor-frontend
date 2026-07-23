import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../services/roadmapService";

function RoadmapPage() {
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      const response = await generateRoadmap(userId);

      if (response.success) {
        setRoadmap(response.roadmap);
      } else {
        alert("Roadmap Generation Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Roadmap Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h1>AI Career Roadmap</h1>

      {loading ? (
        <h3>Generating your personalized roadmap...</h3>
      ) : (
        <>
          <div
            style={{
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: "20px",
              borderRadius: "10px",
              lineHeight: "1.7",
            }}
          >
            {roadmap}
          </div>

          <br />

          <button
            onClick={() => navigate("/daily-task")}
            style={{
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Continue to Daily Tasks →
          </button>
        </>
      )}
    </div>
  );
}

export default RoadmapPage;
