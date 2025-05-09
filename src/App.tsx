
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AddWorkout from "./pages/AddWorkout";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Challenges from "./pages/Challenges";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetails from "./pages/ChallengeDetails";
import LogWorkout from "./pages/LogWorkout";
import TipsAndTricks from "./pages/TipsAndTricks";
import WorkoutReminders from "./pages/WorkoutReminders";
import Leaderboard from "./pages/Leaderboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import React from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/add-workout" element={<ProtectedRoute><AddWorkout /></ProtectedRoute>} />
                <Route path="/log-workout" element={<ProtectedRoute><LogWorkout /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
                <Route path="/challenges/create" element={<ProtectedRoute><CreateChallenge /></ProtectedRoute>} />
                <Route path="/challenges/:id" element={<ProtectedRoute><ChallengeDetails /></ProtectedRoute>} />
                <Route path="/tips" element={<ProtectedRoute><TipsAndTricks /></ProtectedRoute>} />
                <Route path="/reminders" element={<ProtectedRoute><WorkoutReminders /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
