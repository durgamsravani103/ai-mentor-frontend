import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import ResumePage from "../pages/ResumePage";
import RoadmapPage from "../pages/RoadmapPage";
import ChatPage from "../pages/ChatPage";
import DailyTaskPage from "../pages/DailyTaskPage";
import InterviewPage from "../pages/InterviewPage";
import InterviewHistoryPage from "../pages/InterviewHistoryPage";
import ProfilePage from "../pages/ProfilePage";
import AnalyticsPage from "../pages/AnalyticsPage";

import Layout from "../components/Layout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />

        <Route
          path="/resume"
          element={
            <Layout>
              <ResumePage />
            </Layout>
          }
        />

        <Route
          path="/roadmap"
          element={
            <Layout>
              <RoadmapPage />
            </Layout>
          }
        />

        <Route
          path="/daily-task"
          element={
            <Layout>
              <DailyTaskPage />
            </Layout>
          }
        />

        <Route
          path="/interview"
          element={
            <Layout>
              <InterviewPage />
            </Layout>
          }
        />

        <Route
          path="/interview-history"
          element={
            <Layout>
              <InterviewHistoryPage />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />

        <Route
          path="/analytics"
          element={
            <Layout>
              <AnalyticsPage />
            </Layout>
          }
        />

        <Route
          path="/chat"
          element={
            <Layout>
              <ChatPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
