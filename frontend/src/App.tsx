import { Route, Switch } from "wouter";
import { Navigation } from "./components/navigation";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "./pages/not-found";
import Explore from "./pages/explore";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Identify from "./pages/identify";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-gray via-white to-warm-gray dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/explore" component={Explore} />
        <Route path="/identify" component={Identify} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>

      {/* <div>Hello</div> */}
    </div>
  );
}

export default App;
