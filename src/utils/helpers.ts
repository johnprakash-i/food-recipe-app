import type { Meal } from '../types/recipe.types';

/**
 * Parse ingredients and measurements from a meal object
 * TheMealDB stores ingredients in fields like strIngredient1, strIngredient2, etc.
 */
export function parseIngredients(meal: Meal): Array<{ ingredient: string; measure: string }> {
  const ingredients: Array<{ ingredient: string; measure: string }> = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({
        ingredient: ingredient as string,
        measure: (measure as string) || '',
      });
    }
  }

  return ingredients;
}

/**
 * Parse tags from a comma-separated string
 */
export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return match && match[7].length === 11 ? match[7] : null;
}

/**
 * Format instructions by splitting into paragraphs
 */
export function formatInstructions(instructions: string): string[] {
  if (!instructions) return [];
  
  // Split by line breaks or periods followed by capital letters
  return instructions
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}