// src/context/RecipeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Meal, Category, Area, Ingredient } from '../types/recipe.types';

interface RecipeContextType {
  meals: Meal[];
  filteredMeals: Meal[];
  categories: Category[];
  areas: Area[];
  ingredients: Ingredient[];
  searchQuery: string;
  filters: {
    category: string | null;
    area: string | null;
    ingredient: string | null;
  };
  isLoading: boolean;
  error: string | null;
  setMeals: (meals: Meal[]) => void;
  setCategories: (categories: Category[]) => void;
  setAreas: (areas: Area[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: {
    category: string | null;
    area: string | null;
    ingredient: string | null;
  }) => void;
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
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    category: string | null;
    area: string | null;
    ingredient: string | null;
  }>({
    category: null,
    area: null,
    ingredient: null,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Memoized setters (TOP LEVEL — correct)
  const setMealsCb = useCallback((data: Meal[]) => setMeals(data), []);
  const setCategoriesCb = useCallback((data: Category[]) => setCategories(data), []);
  const setAreasCb = useCallback((data: Area[]) => setAreas(data), []);
  const setIngredientsCb = useCallback((data: Ingredient[]) => setIngredients(data), []);
  const setSearchQueryCb = useCallback((q: string) => setSearchQuery(q), []);
  const setFiltersCb = useCallback(
    (f: { category: string | null; area: string | null; ingredient: string | null }) =>
      setFilters(f),
    []
  );
  const setLoadingCb = useCallback((l: boolean) => setLoading(l), []);
  const setErrorCb = useCallback((e: string | null) => setError(e), []);

  // Filter meals
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
        meal.strIngredient1?.toLowerCase().includes(filters.ingredient.toLowerCase()) ||
        meal.strIngredient2?.toLowerCase().includes(filters.ingredient.toLowerCase()) ||
        meal.strIngredient3?.toLowerCase().includes(filters.ingredient.toLowerCase()) ||
        meal.strIngredient4?.toLowerCase().includes(filters.ingredient.toLowerCase()) ||
        meal.strIngredient5?.toLowerCase().includes(filters.ingredient.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        matchesArea &&
        matchesIngredient
      );
    });
  }, [meals, searchQuery, filters]);

  // ✅ useMemo ONLY returns an object (no hooks inside)
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
