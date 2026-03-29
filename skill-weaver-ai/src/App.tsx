import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppProvider, useApp } from "@/context/AppContext";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-react";
import { ReactPlugin } from "@21st-extension/react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LearnPage from "./pages/LearnPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BottlenecksPage from "./pages/BottlenecksPage";
import SimulationPage from "./pages/SimulationPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn, isOnboarded } = useApp();

  if (!isLoggedIn || !isOnboarded) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/bottlenecks" element={<BottlenecksPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
