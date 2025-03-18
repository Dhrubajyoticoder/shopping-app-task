import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import Navbar from "./pages/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Lazy load components to optimize performance
const ProductList = lazy(() => import("./pages/ProductList"));
const Cart = lazy(() => import("./pages/Cart"));

/**
 * App component serves as the main entry point of the application.
 * It includes routing, error handling, and query management.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Navbar Component */}
        <Navbar />

        {/* Error Boundary to catch errors in child components */}
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-spin-slow"></div>
                </div>
              </div>
            }
          >
            <Routes>
              {/* Route for Product List */}
              <Route path="/" element={<ProductList />} />
              
              {/* Route for Cart */}
              <Route path="/cart" element={<Cart />} />

              {/* Catch-all Route for 404 Page Not Found */}
              <Route
                path="*"
                element={
                  <div className="p-4 text-center text-red-600 text-lg font-semibold">
                    Page Not Found
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


