import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume, reAnalyzeResume } from "../services/resumeService";
import axios from "axios";

function ResumePage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState("");
  const [scoreHistory, setScoreHistory] = useState({ prev: null, next: null });
  const [hasPreviousResume, setHasPreviousResume] = useState(false);

  const userId = localStorage.getItem("userId") || "1";
  const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    checkExistingResume();
  }, []);

  const checkExistingResume = async () => {
    try {
      const res = await axios.get(`${apiBaseURL}/dashboard/${userId}`);
      if (res.data.success && res.data.data.resume_score !== undefined) {
        setHasPreviousResume(true);
        // Load latest analysis as default starting view
        setAnalysis({
          resume_score: res.data.data.resume_score,
          skills_found: res.data.data.skills_found,
          missing_skills: res.data.data.missing_skills,
          strengths: res.data.data.strengths,
          improvements: res.data.data.improvements,
          career_recommendation: res.data.data.career_recommendation,
          placement_readiness: `${res.data.data.placement_readiness}%`,
        });
      }
    } catch (err) {
      console.log("No previous resume detected", err);
    }
  };

  const handleUpload = async (isReanalysis = false) => {
    if (!file) {
      alert("Please select a resume PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setComparison("");
      setScoreHistory({ prev: null, next: null });

      let response;
      if (isReanalysis || hasPreviousResume) {
        response = await reAnalyzeResume(file, userId);
        if (response.success) {
          setAnalysis(response.analysis);
          setComparison(response.comparison);
          setScoreHistory({
            prev: response.previous_score,
            next: response.new_score
          });
          setHasPreviousResume(true);
          alert("Resume Re-analysis and Comparison Complete ✅");
        }
      } else {
        response = await uploadResume(file, userId);
        if (response.success) {
          setAnalysis(response.analysis);
          setHasPreviousResume(true);
          alert("Initial Resume Analysis Complete ✅");
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Resume Upload and Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      {/* Title */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 8px 0" }}>Resume AI Consultant</h1>
        <p style={{ color: "#64748b", margin: 0 }}>
          {hasPreviousResume
            ? "Upload a new version of your resume to compare score updates and track structural improvements."
            : "Upload your resume in PDF format to discover core skills, missing technical keywords, and match placement goals."}
        </p>
      </div>

      {/* Upload Zone Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "36px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "40px" }}>📁</span>
        <h3 style={{ margin: "14px 0 6px 0", color: "#1e293b" }}>Upload Resume PDF</h3>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Only PDF format is supported (Max 5MB)</p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: "10px",
              border: "1px dashed #cbd5e1",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
            }}
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              onClick={() => handleUpload(false)}
              disabled={loading}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Analyzing..." : hasPreviousResume ? "Update & Re-Analyze" : "Analyze Resume"}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison results */}
      {comparison && (
        <div
          style={{
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#1e40af", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔄</span> Resume Version Comparison
          </h3>
          {scoreHistory.prev !== null && (
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "12px" }}>
              Score Change: {scoreHistory.prev} ➔ <span style={{ color: "#10b981" }}>{scoreHistory.next}</span>
            </div>
          )}
          <p style={{ margin: 0, fontSize: "14px", color: "#1e293b", lineHeight: "1.6" }}>
            {comparison}
          </p>
          <div style={{ marginTop: "14px", fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
            ✓ AI Roadmap and daily checklists have been successfully updated based on your latest resume.
          </div>
        </div>
      )}

      {/* Detailed Analysis Output */}
      {analysis && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "36px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "20px", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Latest Analysis Results</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Evaluated by Google Gemini Model</span>
            </div>
            
            <div style={{ display: "flex", gap: "24px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Resume Score</span>
                <h3 style={{ margin: 0, color: "#2563eb", fontSize: "24px" }}>{analysis.resume_score}/100</h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Job Readiness</span>
                <h3 style={{ margin: 0, color: "#10b981", fontSize: "24px" }}>{analysis.placement_readiness}</h3>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#1e293b", fontWeight: "600" }}>Career Recommendation</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.6", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                {analysis.career_recommendation}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Technical Skills Found</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {analysis.skills_found?.map((skill, index) => (
                    <span key={index} style={{ padding: "6px 12px", backgroundColor: "#ecfdf5", color: "#065f46", borderRadius: "20px", fontSize: "13px", fontWeight: "500" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#ef4444", fontWeight: "700" }}>Recommended Missing Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {analysis.missing_skills?.map((skill, index) => (
                    <span key={index} style={{ padding: "6px 12px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "20px", fontSize: "13px", fontWeight: "500" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "10px" }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>Resume Strengths</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                  {analysis.strengths?.map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>Suggested Improvements</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                  {analysis.improvements?.map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                alignSelf: "flex-end",
                padding: "12px 24px",
                backgroundColor: "#0f172a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "20px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumePage;
