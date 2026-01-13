// src/components/recipe/RecipeCard.tsx - UPDATED
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart, Clock, Users } from 'lucide-react';
import type { Meal } from '../../types/recipe.types';

interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  meal: Meal;
  compact?: boolean;
  showFavorite?: boolean;
}


const RecipeCard: React.FC<RecipeCardProps> = ({ 
  meal, 
  compact = false, 
  showFavorite = true 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(meal.idMeal);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(meal.idMeal);
  };

  if (compact) {
    return (
      <Link to={`/recipe/${meal.idMeal}`} className="block">
        <div className="card-hover animate-fade-in">
          <div className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                  {meal.strMeal}
                </h3>
                {showFavorite && (
                  <button
                    onClick={handleFavoriteClick}
                    className="flex-shrink-0 text-secondary-400 hover:text-red-500 transition-colors"
                    aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-secondary-500">
                <Badge variant="secondary" size="sm">
                  {meal.strCategory}
                </Badge>
                <span>{meal.strArea}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/recipe/${meal.idMeal}`} className="group block animate-slide-up">
      <div className="card-hover overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Favorite Button - NOW VISIBLE */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:shadow-md"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`} />
            </button>
          )}

          {/* Category Badge */}
          {meal.strCategory && (
            <div className="absolute left-3 top-3">
              <Badge variant="primary">{meal.strCategory}</Badge>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-4 flex-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2">
              {meal.strMeal}
            </h3>
            <p className="line-clamp-2 text-sm text-secondary-600 mb-3">
              {meal.strArea} Cuisine • {meal.strCategory}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-secondary-500 mt-auto">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                30m
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                4 servings
              </span>
            </div>
          </div>
          
          {/* View Recipe Button - NOW ADDED */}
          <div className="mt-4 pt-4 border-t border-secondary-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
            >
              View Full Recipe →
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;