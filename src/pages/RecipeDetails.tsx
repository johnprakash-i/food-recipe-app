// src/pages/RecipeDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';

import { mealsApi } from '../api/mealsApi';
import { parseIngredients, parseTags, getYouTubeId, formatInstructions } from '../utils/helpers';
import type { Meal } from '../types/recipe.types';
import { ArrowLeft, Heart, Clock, Users, Globe, Youtube, BookOpen, ChefHat, Share2 } from 'lucide-react';
import { useRecipeContext } from '../context/useRecipeContext';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useRecipeContext();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await mealsApi.getMealById(id);
        if (response.meals && response.meals.length > 0) {
          setMeal(response.meals[0]);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to load recipe details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share && meal) {
      navigator.share({
        title: meal.strMeal,
        text: `Check out this delicious recipe for ${meal.strMeal}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Loader size="xl" variant="bars" />
          <p className="mt-6 text-lg font-medium text-secondary-600">Loading recipe details...</p>
        </div>
      </Container>
    );
  }

  if (error || !meal) {
    return (
      <Container className="py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-full bg-red-100 p-6">
            <ChefHat className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-secondary-900">Recipe Not Found</h2>
          <p className="mb-8 text-secondary-600">{error || 'The recipe you are looking for does not exist.'}</p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const ingredients = parseIngredients(meal);
  const tags = parseTags(meal.strTags);
  const youtubeId = getYouTubeId(meal.strYoutube);
  const instructions = formatInstructions(meal.strInstructions);
  const favorite = isFavorite(meal.idMeal);

  return (
    <Container className="py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeft className="h-4 w-4" />}
        className="mb-8"
      >
        Back to Recipes
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Image & Basic Info */}
        <div className="space-y-6">
          {/* Recipe Image */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="relative aspect-[4/3]">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge variant="primary">{meal.strCategory}</Badge>
                <Badge variant="secondary">{meal.strArea}</Badge>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(meal.idMeal)}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-3 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-6 w-6 ${favorite ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleShare}
              leftIcon={<Share2 className="h-4 w-4" />}
            >
              Share Recipe
            </Button>
            <Button
              variant={favorite ? 'danger' : 'outline'}
              className="flex-1"
              onClick={() => toggleFavorite(meal.idMeal)}
              leftIcon={<Heart className={`h-4 w-4 ${favorite ? 'fill-white' : ''}`} />}
            >
              {favorite ? 'Remove Favorite' : 'Add to Favorites'}
            </Button>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-secondary-200 bg-white p-4 text-center">
              <Clock className="mx-auto mb-2 h-6 w-6 text-primary-500" />
              <div className="text-sm font-medium text-secondary-700">Prep Time</div>
              <div className="text-lg font-bold text-secondary-900">30 mins</div>
            </div>
            <div className="rounded-xl border border-secondary-200 bg-white p-4 text-center">
              <Users className="mx-auto mb-2 h-6 w-6 text-primary-500" />
              <div className="text-sm font-medium text-secondary-700">Servings</div>
              <div className="text-lg font-bold text-secondary-900">4 people</div>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-secondary-700 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="accent" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recipe Details */}
        <div className="space-y-8">
          {/* Recipe Title & Description */}
          <div>
            <h1 className="mb-3 text-4xl font-bold text-secondary-900">{meal.strMeal}</h1>
            <div className="mb-4 flex items-center gap-4 text-secondary-600">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {meal.strArea} Cuisine
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {meal.strCategory}
              </span>
            </div>
            <p className="text-lg text-secondary-700">
              A delicious {meal.strCategory.toLowerCase()} recipe from {meal.strArea}. 
              Perfect for any occasion and loved by food enthusiasts worldwide.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-secondary-200">
            <nav className="-mb-px flex gap-8">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`border-b-2 px-1 py-3 text-lg font-medium transition-colors ${
                  activeTab === 'ingredients'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`border-b-2 px-1 py-3 text-lg font-medium transition-colors ${
                  activeTab === 'instructions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Instructions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'ingredients' ? (
              <div className="space-y-6">
                <div className="rounded-xl border border-secondary-200 bg-white p-6">
                  <h3 className="mb-4 text-xl font-semibold text-secondary-900">
                    Ingredients ({ingredients.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ingredients.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-secondary-100 bg-secondary-50 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                          <span className="text-sm font-medium text-primary-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-secondary-900">{item.ingredient}</div>
                          <div className="text-sm text-secondary-600">{item.measure}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Optional: Shopping List */}
                <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-primary-900">
                    <BookOpen className="h-5 w-5" />
                    Shopping List
                  </h3>
                  <p className="mb-4 text-primary-700">
                    Need these ingredients? Copy the list to your shopping app.
                  </p>
                  <Button variant="outline" size="sm">
                    Copy Shopping List
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl border border-secondary-200 bg-white p-6">
                  <h3 className="mb-6 text-xl font-semibold text-secondary-900">
                    Cooking Instructions
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    {instructions.map((paragraph, index) => (
                      <div key={index} className="mb-6">
                        <div className="mb-2 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-secondary-900">
                            Step {index + 1}
                          </h4>
                        </div>
                        <p className="text-secondary-700">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* YouTube Video */}
                {youtubeId && (
                  <div className="rounded-xl border border-secondary-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-secondary-900">Video Tutorial</h3>
                    </div>
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={`${meal.strMeal} video tutorial`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      Watch on YouTube
                      <Youtube className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Source Link */}
          {meal?.strSource && (
            <div className="rounded-xl border border-secondary-200 bg-white p-6">
              <h3 className="mb-2 text-lg font-semibold text-secondary-900">Recipe Source</h3>
              <p className="mb-4 text-secondary-600">
                This recipe is originally from:
              </p>
              <a
                href={meal?.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                Visit Original Recipe
                <Globe className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Similar Recipes Section */}
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-secondary-900">
          More {meal.strCategory} Recipes
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* This would be populated with actual similar recipes in a real app */}
          <div className="rounded-xl border border-secondary-200 bg-white p-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100">
              <ChefHat className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="mb-2 font-medium text-secondary-900">Discover More Recipes</h3>
            <p className="mb-4 text-sm text-secondary-600">
              Browse more delicious {meal.strCategory.toLowerCase()} recipes.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Explore Recipes
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RecipeDetails;