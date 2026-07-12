import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/student/Home";
import Playground from "./pages/student/Playground";
import PublicSubjectsPage from "./pages/student/PublicSubjectsPage";

import Login from "./pages/Login";
import Profile from "./pages/common/Profile";
import LMSLayout from "./components/layouts/LMSLayout";
import { Scroll } from "./components/Scroll";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminEvaluationsPage } from "./pages/admin/AdminEvaluationsPage";
import AdminUsers from "./pages/admin/AdminUsers";
import { AdminCMSPage } from "./pages/admin/AdminCMSPage";

import { useAuthStore } from "./store/useAuthStore";
import Landing from "./pages/Landing";

import ModulePage from "./pages/student/ModulePage";
import SubjectPage from "./pages/student/SubjectPage";
import TopicFallbackPage from "./pages/student/TopicFallbackPage";
import { ConfirmProvider } from "./contexts/ConfirmContext";
import Loading from "./components/Loading";

const App = () => {
  const { fetchMe, user, loading } = useAuthStore();
  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <Loading />
      </div>
    );
  }

  return (
    <ConfirmProvider>
      <Toaster position="top-right" />
      <div className="h-dvh overflow-hidden">
        <Scroll />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            element={
              // <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
              <LMSLayout />
              // </ProtectedRoute>
            }
          >
            <Route path="/lms" element={<Home />} />
          </Route>
          {/* Pages inside the LMS student shell (header + sidebar) */}
          <Route
            element={
              // <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                <LMSLayout />
              // </ProtectedRoute>
            }
          >
            <Route path="/playground" element={<Playground />} />
            <Route path="/public-subjects" element={<PublicSubjectsPage />} />
            <Route
              path="/:moduleKey/:subjectKey/*"
              element={<TopicFallbackPage />}
            />
            <Route path="/:moduleKey/:subjectKey" element={<SubjectPage />} />
            <Route path="/:moduleKey" element={<ModulePage />} />
            <Route path="/*" element={<TopicFallbackPage />} />
          </Route>

          {/* Admin / Teacher portal — own shell, no LMS layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/cms" replace />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="cms" element={<AdminCMSPage />} />
            <Route path="cms/:moduleId" element={<AdminCMSPage />} />
            <Route
              path="cms/:moduleId/:subjectKey"
              element={<AdminCMSPage />}
            />
            <Route
              path="cms/:moduleId/:subjectKey/:topicId"
              element={<AdminCMSPage />}
            />
            <Route path="evaluations" element={<AdminEvaluationsPage />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/cms" replace />} />
            <Route path="cms" element={<AdminCMSPage />} />
            <Route path="cms/:moduleId" element={<AdminCMSPage />} />
            <Route
              path="cms/:moduleId/:subjectKey"
              element={<AdminCMSPage />}
            />
            <Route
              path="cms/:moduleId/:subjectKey/:topicId"
              element={<AdminCMSPage />}
            />
            <Route path="evaluations" element={<AdminEvaluationsPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Shared standalone pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Auth pages — no shell */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </ConfirmProvider>
  );
};

export default App;
