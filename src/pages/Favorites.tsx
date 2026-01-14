import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import RecipeGrid from "../components/recipe/RecipeGrid";
import Button from "../components/common/Button";
import { Heart, ArrowLeft } from "lucide-react";
import { useRecipeContext } from "../context/useRecipeContext";
import type { Meal } from "../types/recipe.types";

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, clearFavorites } = useRecipeContext();
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
 

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteMeals([]);
      return;
    }

    const fetchFavorites = async () => {
      
      try {
        const results = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
            );
            const data = await res.json();
            return data.meals?.[0];
          })
        );

        setFavoriteMeals(results.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch favorite meals", err);
      } 
    };

    fetchFavorites();
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <Container className="py-12">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>

        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Heart className="h-16 w-16 text-primary-400 mb-6" />
          <h1 className="text-3xl font-bold">No favorites yet</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Your Favorites ({favorites.length})
        </h1>
        <Button variant="outline" onClick={clearFavorites}>
          Clear All
        </Button>
      </div>

      <RecipeGrid
        meals={favoriteMeals}
        // loading={loading}
        emptyMessage="No favorite recipes found"
        columns={3}
      />
    </Container>
  );
};

export default Favorites;
