// src/pages/Favorites.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import RecipeGrid from "../components/recipe/RecipeGrid";
import Button from "../components/common/Button";
import { useFavorites } from "../hooks/useFavorites";

import { Heart, ArrowLeft, ChefHat } from "lucide-react";
import { useRecipeContext } from "../context/useRecipeContext";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites,clearFavorites } = useFavorites();
  const { meals } = useRecipeContext();

  // Get favorite meal details from the meals list
  const favoriteMeals = meals.filter((meal) => favorites.includes(meal.idMeal));

 const handleClearAll = () => {
 
      clearFavorites();
    
  };;

  if (favorites.length === 0) {
    return (
      <Container className="py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="mb-8"
        >
          Back to Recipes
        </Button>

        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-8 rounded-full bg-primary-50 p-8">
            <Heart className="h-16 w-16 text-primary-400" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-secondary-900">
            No favorites yet
          </h1>
          <p className="mb-8 max-w-md text-lg text-secondary-600">
            Start exploring recipes and click the heart icon to save your
            favorites here.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => navigate("/")}>
              <ChefHat className="mr-2 h-4 w-4" />
              Browse Recipes
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Discover Trending
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
          >
            Back to Recipes
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-50 p-3">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Your Favorites
              </h1>
              <p className="text-secondary-600">
                {favorites.length}{" "}
                {favorites.length === 1 ? "recipe" : "recipes"} saved
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleClearAll}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          Clear All
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl bg-gradient-to-r from-primary-50 to-red-50 p-6 md:grid-cols-3">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-700">
            {favorites.length}
          </div>
          <p className="text-secondary-700">Total Favorites</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-700">
            {new Set(favoriteMeals.map((m) => m.strCategory)).size}
          </div>
          <p className="text-secondary-700">Categories</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-700">
            {new Set(favoriteMeals.map((m) => m.strArea)).size}
          </div>
          <p className="text-secondary-700">Cuisine Areas</p>
        </div>
      </div>

      {/* Favorites Grid */}
      <RecipeGrid
        meals={favoriteMeals}
        emptyMessage="You haven't saved any recipes yet"
        columns={3}
      />

      {/* Categories Summary */}
      {favoriteMeals.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-secondary-900">
            Favorite Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(favoriteMeals.map((m) => m.strCategory))).map(
              (category) => {
                const count = favoriteMeals.filter(
                  (m) => m.strCategory === category
                ).length;
                return (
                  <div
                    key={category}
                    className="rounded-lg border border-secondary-200 bg-white px-4 py-3"
                  >
                    <div className="font-medium text-secondary-900">
                      {category}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {count} recipes
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default Favorites;
