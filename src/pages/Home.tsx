// src/pages/Home.tsx
import React, { useEffect, useState } from "react";

import Container from "../components/layout/Container";
import SearchBar from "../components/recipe/SearchBar";
import RecipeFilters from "../components/recipe/RecipeFilters";
import RecipeGrid from "../components/recipe/RecipeGrid";
import Loader from "../components/common/Loader";
import { mealsApi } from "../api/mealsApi";
import { ChefHat, Sparkles, RefreshCw } from "lucide-react";
import { useRecipeContext } from "../context/useRecipeContext";
import type { Meal } from "../types/recipe.types";

const Home: React.FC = () => {
  const {
    meals,
    filteredMeals,
    categories,
    areas,
    ingredients,
    filters,
    searchQuery,
    setMeals,
    setCategories,
    setAreas,
    setIngredients,
    setSearchQuery,
    setFilters,
    isLoading,
    setLoading,
  } = useRecipeContext();

  const [showLoadMore, setShowLoadMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Load initial meals and filter options
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Load initial meals
        const mealsResponse = await mealsApi.getInitialMeals();
        if (mealsResponse.meals) {
          setMeals(mealsResponse.meals);
        }

        // Load categories
        const categoriesResponse = await mealsApi.getCategories();
        if (categoriesResponse.categories) {
          setCategories(categoriesResponse.categories);
        }

        // Load areas
        const areasResponse = await mealsApi.getAreas();
        if (areasResponse.meals) {
          setAreas(areasResponse.meals);
        }

        // Load ingredients
        const ingredientsResponse = await mealsApi.getIngredients();
        if (ingredientsResponse.meals) {
          setIngredients(ingredientsResponse.meals);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setMeals, setCategories, setAreas, setIngredients, setLoading]);

  // Handle search API call
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        // If search is cleared, reload initial meals
        if (meals.length === 0) {
          setLoading(true);
          try {
            const response = await mealsApi.getInitialMeals();
            if (response.meals) {
              setMeals(response.meals);
            }
          } catch (error) {
            console.error("Failed to load meals:", error);
          } finally {
            setLoading(false);
          }
        }
        return;
      }

      setLoading(true);
      try {
        const response = await mealsApi.searchMealsByName(searchQuery);
        if (response.meals) {
          setMeals(response.meals);
        } else {
          setMeals([]);
        }
      } catch (error) {
        console.error("Failed to search meals:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setMeals, setLoading, meals.length]);

  // Handle filter API calls
  useEffect(() => {
    const handleFilter = async () => {
      if (filters.category || filters.area || filters.ingredient) {
        setLoading(true);
        try {
          let response;
          if (filters.category) {
            response = await mealsApi.filterByCategory(filters.category);
          } else if (filters.area) {
            response = await mealsApi.filterByArea(filters.area);
          } else if (filters.ingredient) {
            response = await mealsApi.filterByIngredient(filters.ingredient);
            console.log(response);
          }

          if (response?.meals) {
            // Fetch full details for each meal
            const fullMeals = await Promise.all(
              response.meals.map(async (meal) => {
                const detailRes = await mealsApi.getMealById(meal.idMeal);
                return detailRes.meals?.[0];
              })
            );

            setMeals(
              fullMeals.filter((meal): meal is Meal => meal !== undefined)
            );
          } else {
            setMeals([]);
          }
        } catch (error) {
          console.error("Failed to filter meals:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (filters.category || filters.area || filters.ingredient) {
      const timer = setTimeout(() => {
        handleFilter();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [filters, setMeals, setLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string | null) => {
    setFilters({ ...filters, category });
  };

  const handleAreaChange = (area: string | null) => {
    setFilters({ ...filters, area });
  };

  const handleIngredientChange = (ingredient: string | null) => {
    setFilters({ ...filters, ingredient });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ category: null, area: null, ingredient: null });
    setVisibleCount(12);
    setShowLoadMore(false);

    // Reload initial meals
    const reloadInitialMeals = async () => {
      setLoading(true);
      try {
        const response = await mealsApi.getInitialMeals();
        if (response.meals) {
          setMeals(response.meals);
        }
      } catch (error) {
        console.error("Failed to reload meals:", error);
      } finally {
        setLoading(false);
      }
    };

    reloadInitialMeals();
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setSearchQuery("");
    setFilters({ category: null, area: null, ingredient: null });
    setVisibleCount(12);
    setShowLoadMore(false);

    try {
      const response = await mealsApi.getInitialMeals();
      if (response.meals) {
        setMeals(response.meals);
      }
    } catch (error) {
      console.error("Failed to refresh meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayMeals =
    searchQuery || filters.category || filters.area || filters.ingredient
      ? filteredMeals
      : meals;

  // Show load more button if we have more meals
  useEffect(() => {
    setShowLoadMore(displayMeals.length > visibleCount);
  }, [displayMeals.length, visibleCount]);

  return (
    <Container>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-primary-50 px-6 py-3">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">
            Discover amazing recipes from around the world
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Cook something <span className="text-primary-600">delicious</span>{" "}
          today
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-secondary-600">
          Browse thousands of recipes, filter by cuisine, category, or
          ingredients, and save your favorites for later.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary-900">
            <ChefHat className="mr-2 inline h-6 w-6 text-primary-500" />
            Find Your Next Meal
          </h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh Recipes"}
          </button>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for recipes (e.g., pizza, pasta, curry)..."
          className="mb-6"
          autoFocus
        />

        <RecipeFilters
          categories={categories}
          areas={areas}
          ingredients={ingredients}
          selectedCategory={filters.category}
          selectedArea={filters.area}
          selectedIngredient={filters.ingredient}
          onCategoryChange={handleCategoryChange}
          onAreaChange={handleAreaChange}
          onIngredientChange={handleIngredientChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Results Info */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">
            {displayMeals.length}{" "}
            {displayMeals.length === 1 ? "Recipe" : "Recipes"} Found
          </h3>
          {(searchQuery ||
            filters.category ||
            filters.area ||
            filters.ingredient) && (
            <p className="mt-1 text-sm text-secondary-500">
              {searchQuery && `Search: "${searchQuery}"`}
              {filters.category && ` • Category: ${filters.category}`}
              {filters.area && ` • Area: ${filters.area}`}
              {filters.ingredient && ` • Ingredient: ${filters.ingredient}`}
            </p>
          )}
        </div>

        {displayMeals.length > 0 && (
          <div className="text-sm text-secondary-500">
            Showing {Math.min(displayMeals.length, visibleCount)} of{" "}
            {displayMeals.length}
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      {isLoading && meals.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader size="xl" variant="bars" />
            <p className="mt-4 text-lg font-medium text-secondary-600">
              Loading recipes...
            </p>
          </div>
        </div>
      ) : (
        <>
          <RecipeGrid
            meals={displayMeals.slice(0, visibleCount)}
            isLoading={false}
            emptyMessage={
              searchQuery ||
              filters.category ||
              filters.area ||
              filters.ingredient
                ? "No recipes match your search criteria. Try adjusting your filters."
                : "No recipes available at the moment. Please check back later."
            }
          />

          {/* Load More Button */}
          {showLoadMore && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="btn btn-outline px-8 py-3 text-base font-medium hover:bg-primary-50"
              >
                Load More Recipes ({displayMeals.length - visibleCount} more)
              </button>
            </div>
          )}
        </>
      )}

      {/* Stats Section */}
      {!isLoading && displayMeals.length > 0 && (
        <div className="mt-16 grid grid-cols-1 gap-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-primary-700">
              {displayMeals.length}+
            </div>
            <p className="text-secondary-700">Recipes Available</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-primary-700">
              {new Set(displayMeals.map((m: any) => m.strCategory)).size}+
            </div>
            <p className="text-secondary-700">Categories</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-3xl font-bold text-primary-700">
              {new Set(displayMeals.map((m: any) => m.strArea)).size}+
            </div>
            <p className="text-secondary-700">Cuisine Areas</p>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;
