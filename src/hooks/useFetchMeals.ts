import { useState, useEffect, useCallback, useRef } from 'react';
import { mealsApi } from '../api/mealsApi';
import type { Meal } from '../types/recipe.types';

interface UseFetchMealsResult {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching meals with optimized API calls
 * Only fetches on mount or when explicitly called via refetch
 */
export function useFetchMeals(): UseFetchMealsResult {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchMeals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch initial meals (searching by first letter 'a' gives good variety)
      const response = await mealsApi.getInitialMeals();

      if (response.meals) {
        // Limit to first 10 meals
        setMeals(response.meals.slice(0, 10));
      } else {
        setMeals([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch only once on mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchMeals();
    }
  }, [fetchMeals]);

  const refetch = useCallback(async () => {
    await fetchMeals();
  }, [fetchMeals]);

  return { meals, isLoading, error, refetch };
}