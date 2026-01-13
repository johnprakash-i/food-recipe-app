import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Meal, Category } from '../types/recipe.types';

interface RecipeContextType {
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  filteredMeals: Meal[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized filtered meals based on search and category
  const filteredMeals = useMemo(() => {
    let filtered = meals;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((meal) =>
        meal.strMeal.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((meal) => meal.strCategory === selectedCategory);
    }

    return filtered;
  }, [meals, searchQuery, selectedCategory]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      meals,
      setMeals: useCallback((newMeals: Meal[]) => setMeals(newMeals), []),
      categories,
      setCategories: useCallback((newCategories: Category[]) => setCategories(newCategories), []),
      selectedCategory,
      setSelectedCategory: useCallback((category: string) => setSelectedCategory(category), []),
      searchQuery,
      setSearchQuery: useCallback((query: string) => setSearchQuery(query), []),
      isLoading,
      setIsLoading: useCallback((loading: boolean) => setIsLoading(loading), []),
      error,
      setError: useCallback((err: string | null) => setError(err), []),
      filteredMeals,
    }),
    [meals, categories, selectedCategory, searchQuery, isLoading, error, filteredMeals]
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export const useRecipeContext = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};