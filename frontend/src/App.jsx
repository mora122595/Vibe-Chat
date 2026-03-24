import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import useAuthStore from "./stores/UseAuthStore";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import useThemeStore from "./stores/UseThemeStore.js";

export const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="mt-2 text-sm">Checking Authentication</p>
      </div>
    );
  }

  return (
    <div data-theme={theme} className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 overflow-hidden h-full">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUpPage />}
          />
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Toaster />
      </main>
    </div>
  );
};

export default App;
