import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Home from "@/pages/home";
import Wizard from "@/pages/wizard";
import NotFound from "@/pages/not-found";
import { gradients } from "./styles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wizard" component={Wizard} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function WorkflowWizard() {
  return (
    <div className={`min-h-screen ${gradients.background}`}>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}
