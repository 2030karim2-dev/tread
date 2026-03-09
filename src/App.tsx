import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { ErrorBoundary, LoadingSkeleton } from "@/components/shared";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TripsPage = lazy(() => import("./pages/TripsPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const QuotationsPage = lazy(() => import("./pages/QuotationsPage"));
const PurchasesPage = lazy(() => import("./pages/PurchasesPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const SalesPage = lazy(() => import("./pages/SalesPage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));

const queryClient = new QueryClient();

function PageLoader() {
  return <LoadingSkeleton rows={4} type="cards" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/quotations" element={<QuotationsPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
