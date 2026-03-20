import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProfilesDirectory from "./pages/ProfilesDirectory.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AuthTerminal from "./pages/AuthTerminal.tsx";
import CreateProfilePage from "./pages/CreateProfilePage.tsx";
import ShellPage from "./pages/ShellPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthTerminal />} />
          <Route path="/create" element={<CreateProfilePage />} />
          <Route path="/initialize" element={<CreateProfilePage />} />
          <Route path="/shell" element={<ShellPage />} />
          <Route path="/profiles" element={<ProfilesDirectory />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
