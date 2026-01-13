import axios, { AxiosError } from 'axios';
import type {
  MealsResponse,
  CategoriesResponse,
  AreasResponse,
  IngredientsResponse,
} from '../types/recipe.types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
  } else if (error.request) {
    throw new Error('Network Error: No response received from server');
  } else {
    throw new Error(`Request Error: ${error.message}`);
  }
};

// API Methods
export const mealsApi = {
  // Get initial 10 random meals (for homepage)
  async getInitialMeals(): Promise<MealsResponse> {
    try {
      // TheMealDB doesn't have a "get first 10" endpoint, so we'll search for common letter
      const response = await api.get<MealsResponse>('/search.php?f=a');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Search meals by name
  async searchMealsByName(query: string): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>(`/search.php?s=${query}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get meal by ID
  async getMealById(id: string): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>(`/lookup.php?i=${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get random meal
  async getRandomMeal(): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>('/random.php');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Filter by category
  async filterByCategory(category: string): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>(`/filter.php?c=${category}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Filter by area
  async filterByArea(area: string): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>(`/filter.php?a=${area}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Filter by main ingredient
  async filterByIngredient(ingredient: string): Promise<MealsResponse> {
    try {
      const response = await api.get<MealsResponse>(`/filter.php?i=${ingredient}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get all categories
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await api.get<CategoriesResponse>('/categories.php');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get all areas
  async getAreas(): Promise<AreasResponse> {
    try {
      const response = await api.get<AreasResponse>('/list.php?a=list');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get all ingredients
  async getIngredients(): Promise<IngredientsResponse> {
    try {
      const response = await api.get<IngredientsResponse>('/list.php?i=list');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

export default mealsApi;