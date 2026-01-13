// src/context/RecipeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { Meal, Category, Area, Ingredient } from '../types/recipe.types';

const FAVORITES_KEY = 'recipe_favorites_v2';

interface Filters {
  category: string | null;
  area: string | null;
  ingredient: string | null;
}

interface RecipeContextType {
  // Data
  meals: Meal[];
  filteredMeals: Meal[];
  categories: Category[];
  areas: Area[];
  ingredients: Ingredient[];

  // Search & filters
  searchQuery: string;
  filters: Filters;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Favorites (✅ FIXED & GLOBAL)
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;

  // Setters
  setMeals: (meals: Meal[]) => void;
  setCategories: (categories: Category[]) => void;
  setAreas: (areas: Area[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Filters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  // -----------------------------
  // Core recipe state
  // -----------------------------
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: null,
    area: null,
    ingredient: null,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Favorites (GLOBAL + PERSISTENT)
  // -----------------------------
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  const addFavorite = useCallback((id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  // -----------------------------
  // Filtered meals
  // -----------------------------
  const filteredMeals = useMemo(() => {
    return meals.filter(meal => {
      const matchesSearch =
        !searchQuery ||
        meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.category || meal.strCategory === filters.category;

      const matchesArea =
        !filters.area || meal.strArea === filters.area;

      const matchesIngredient =
        !filters.ingredient ||
        [
          meal.strIngredient1,
          meal.strIngredient2,
          meal.strIngredient3,
          meal.strIngredient4,
          meal.strIngredient5,
        ]
          .filter(Boolean)
          .some(ing =>
            ing!.toLowerCase().includes(filters.ingredient!.toLowerCase())
          );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesArea &&
        matchesIngredient
      );
    });
  }, [meals, searchQuery, filters]);

  // -----------------------------
  // Memoized setters
  // -----------------------------
  const setMealsCb = useCallback((data: Meal[]) => setMeals(data), []);
  const setCategoriesCb = useCallback((data: Category[]) => setCategories(data), []);
  const setAreasCb = useCallback((data: Area[]) => setAreas(data), []);
  const setIngredientsCb = useCallback((data: Ingredient[]) => setIngredients(data), []);
  const setSearchQueryCb = useCallback((q: string) => setSearchQuery(q), []);
  const setFiltersCb = useCallback((f: Filters) => setFilters(f), []);
  const setLoadingCb = useCallback((l: boolean) => setLoading(l), []);
  const setErrorCb = useCallback((e: string | null) => setError(e), []);

  // -----------------------------
  // Context value
  // -----------------------------
  const value = useMemo(
    () => ({
      meals,
      filteredMeals,
      categories,
      areas,
      ingredients,
      searchQuery,
      filters,
      isLoading,
      error,

      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,

      setMeals: setMealsCb,
      setCategories: setCategoriesCb,
      setAreas: setAreasCb,
      setIngredients: setIngredientsCb,
      setSearchQuery: setSearchQueryCb,
      setFilters: setFiltersCb,
      setLoading: setLoadingCb,
      setError: setErrorCb,
    }),
    [
      meals,
      filteredMeals,
      categories,
      areas,
      ingredients,
      searchQuery,
      filters,
      isLoading,
      error,
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      setMealsCb,
      setCategoriesCb,
      setAreasCb,
      setIngredientsCb,
      setSearchQueryCb,
      setFiltersCb,
      setLoadingCb,
      setErrorCb,
    ]
  );

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};
