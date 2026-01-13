// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Container from "./components/layout/Container";
import Loader from "./components/common/Loader";
import { RecipeProvider } from "./context/useRecipeContext";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center">
      <Loader size="xl" variant="bars" />
      <p className="mt-4 text-lg font-medium text-secondary-600">
        Loading page...
      </p>
    </div>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="flex min-h-[70vh] items-center justify-center">
    <Container>
      <div className="text-center">
        <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-secondary-100">
          <span className="text-5xl">🔍</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-secondary-900">
          Page Not Found
        </h1>
        <p className="mb-8 text-lg text-secondary-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
        >
          ← Back to Home
        </a>
      </div>
    </Container>
  </div>
);

function App() {
  return (
    <Router>
      <RecipeProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Navbar />
          <main className="py-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="border-t border-secondary-200 bg-white py-8">
            <Container>
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                      <span className="text-lg font-bold text-white">🍽</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary-900">
                        Recipe<span className="text-primary-600">Hub</span>
                      </h3>
                      <p className="text-sm text-secondary-500">
                        Discover & cook amazing meals
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-secondary-600">
                    Powered by TheMealDB API • Made with ❤️ for food lovers
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <a
                    href="https://www.themealdb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    API Documentation
                  </a>
                  <a
                    href="https://github.com/johnprakash-i/food-recipe-app/tree/dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    GitHub
                  </a>
                  <span className="text-sm text-secondary-400">
                    © {new Date().getFullYear()} RecipeHub
                  </span>
                </div>
              </div>
            </Container>
          </footer>
        </div>
      </RecipeProvider>
    </Router>
  );
}

export default App;
