import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveOnboarding } from "../services/onboardingService";

function OnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
    target_role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        cgpa: Number(formData.cgpa),
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      await saveOnboarding(payload);

      alert("Onboarding Completed ✅");

      navigate("/resume");
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Onboarding Failed",
      );
    }
  };

  return (
    <div style={{ width: "500px", margin: "30px auto" }}>
      <h2>Career Onboarding</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <br />
        <br />

        <input name="college" placeholder="College" onChange={handleChange} />
        <br />
        <br />

        <input name="degree" placeholder="Degree" onChange={handleChange} />
        <br />
        <br />

        <input name="branch" placeholder="Branch" onChange={handleChange} />
        <br />
        <br />

        <input
          type="number"
          name="year"
          placeholder="Year"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          type="number"
          step="0.1"
          name="cgpa"
          placeholder="CGPA"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="skills"
          placeholder="Python, React, FastAPI"
          onChange={handleChange}
        />
        <br />
        <br />

        <input
          name="target_role"
          placeholder="Target Role"
          onChange={handleChange}
        />
        <br />
        <br />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default OnboardingPage;
