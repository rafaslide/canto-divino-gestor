import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Playlists from "./pages/Playlists";
import Import from "./pages/Import";
import MusicDetail from "./pages/MusicDetail";
import PlaylistDetail from "./pages/PlaylistDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useMigration } from '@/hooks/useMigration';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { isMigrating } = useMigration(); // Add migration hook
  
  if (isMigrating) {
    return <div>Migrating data...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/library" 
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/playlists" 
        element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/playlists/:id" 
        element={
          <ProtectedRoute>
            <PlaylistDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/import" 
        element={
          <ProtectedRoute>
            <Import />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/music/:id" 
        element={
          <ProtectedRoute>
            <MusicDetail />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
