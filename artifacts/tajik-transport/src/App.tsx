import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Services } from "./components/services";
import { FleetTeaser } from "./components/fleet";
import { Booking } from "./components/booking";
import { Reviews } from "./components/reviews";
import { FAQ } from "./components/faq";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";

import { FleetPage } from "./pages/FleetPage";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { AdminPage } from "./pages/AdminPage";

const queryClient = new QueryClient();

function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      <Hero />
      <Services />
      <FleetTeaser />
      <Booking />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fleet" component={FleetPage} />
      <Route path="/fleet/:id" component={VehicleDetailPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
