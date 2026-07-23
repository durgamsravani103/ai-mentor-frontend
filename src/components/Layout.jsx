import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const notifRef = useRef(null);

  const userId = localStorage.getItem("userId") || "1";
  const apiBaseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    fetchProfile();
    fetchNotifications();

    // Close notifications dropdown on click outside
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${apiBaseURL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${apiBaseURL}/notifications/${userId}`);
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Resume Analysis", path: "/resume", icon: "📄" },
    { label: "AI Roadmap", path: "/roadmap", icon: "🗺️" },
    { label: "Daily Tasks", path: "/daily-task", icon: "📝" },
    { label: "Mock Interview", path: "/interview", icon: "🎙️" },
    { label: "Interview History", path: "/interview-history", icon: "🕰️" },
    { label: "Analytics", path: "/analytics", icon: "📈" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar navigation */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.05)",
          zIndex: 100,
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "24px" }}>🎯</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "#f8fafc" }}>Placement Mentor</h2>
            <span style={{ fontSize: "11px", color: "#64748b" }}>AI Career Accelerator</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#1e293b";
                    e.currentTarget.style.color = "#f1f5f9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "20px", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "10px" }}>
          {userProfile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {userProfile.name ? userProfile.name[0].toUpperCase() : userProfile.username[0].toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {userProfile.name || userProfile.username}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {userProfile.email || "No email set"}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "transparent",
              border: "1px solid #334155",
              color: "#f1f5f9",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ef4444";
              e.currentTarget.style.borderColor = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#334155";
            }}
          >
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: "70px",
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 40px",
            position: "sticky",
            top: 0,
            zIndex: 90,
          }}
        >
          {/* Notifications dropdown bell */}
          <div ref={notifRef} style={{ position: "relative", marginRight: "20px" }}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              style={{
                background: "none",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                position: "relative",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            >
              🔔
              {notifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50px",
                  width: "320px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e2e8f0",
                  padding: "10px 0",
                  zIndex: 200,
                }}
              >
                <div style={{ padding: "10px 20px", fontWeight: "bold", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "between", alignItems: "center" }}>
                  <span>Notifications</span>
                  <span style={{ fontSize: "11px", backgroundColor: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "10px" }}>
                    {notifications.length} alerts
                  </span>
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                      🎉 You are all caught up!
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          setShowNotifMenu(false);
                          navigate(notif.action_link);
                        }}
                        style={{
                          padding: "12px 20px",
                          borderBottom: "1px solid #f8fafc",
                          cursor: "pointer",
                          transition: "background 0.2s",
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <span style={{ fontSize: "16px", marginTop: "2px" }}>
                          {notif.type === "warning" ? "⚠️" : "💡"}
                        </span>
                        <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.4" }}>
                          {notif.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic page content wrapped */}
        <main style={{ flex: 1, padding: "40px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
