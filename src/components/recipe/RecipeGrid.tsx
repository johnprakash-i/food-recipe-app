// src/components/recipe/RecipeGrid.tsx
import React from 'react';
import RecipeCard from './RecipeCard';
import Loader from '../common/Loader';
import type { Meal } from '../../types/recipe.types';

export interface RecipeGridProps {
  meals: Meal[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  compact?: boolean;
  columns?: number;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  meals,
  isLoading = false,
  error,
  emptyMessage = 'No recipes found',
  compact = false,
  columns = 4,
}) => {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" variant="bars" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (meals.length === 0) {
    return <div className="text-center">{emptyMessage}</div>;
  }

  return (
    <div className={`grid ${gridColumns} gap-6`}>
      {meals.map((meal, index) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          compact={compact}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
