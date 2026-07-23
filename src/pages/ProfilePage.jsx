import { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
    target_role: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(`${apiBaseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setFormData({
        name: data.name || "",
        email: data.email || "",
        college: data.college || "",
        degree: data.degree || "",
        branch: data.branch || "",
        year: data.year ? String(data.year) : "",
        cgpa: data.cgpa ? String(data.cgpa) : "",
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        target_role: data.target_role || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to fetch profile details.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        email: formData.email,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        year: formData.year ? Number(formData.year) : null,
        cgpa: formData.cgpa ? Number(formData.cgpa) : null,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        target_role: formData.target_role,
      };

      const response = await axios.put(`${apiBaseURL}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.detail || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <h2>Loading Profile Details...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", margin: "0 0 8px 0" }}>User Profile</h1>
        <p style={{ color: "#64748b", margin: 0 }}>View and update your target role, skills, and academic profile.</p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          padding: "36px",
        }}
      >
        {success && (
          <div
            style={{
              padding: "12px 20px",
              backgroundColor: "#d1fae5",
              color: "#065f46",
              borderRadius: "8px",
              marginBottom: "24px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ✓ Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section 1: Basic Info */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              Basic Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Placement Details */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              Career & Placement Goals
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "span 2" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Target Job Role</label>
                <input
                  type="text"
                  name="target_role"
                  value={formData.target_role}
                  onChange={handleChange}
                  placeholder="Software Engineer, Product Manager"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "span 2" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Technical Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, PostgreSQL"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>These skills are verified in your resume and evaluated by mock interviews.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Education */}
          <div>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              Academic Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "span 2" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>College / University</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="State University"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="B.Tech, B.S., M.S."
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Branch / Major</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Graduation Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2026"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Current CGPA / GPA</label>
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="8.5"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-end",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            {loading ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
