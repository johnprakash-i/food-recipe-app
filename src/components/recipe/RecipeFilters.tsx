// src/components/recipe/RecipeFilters.tsx - UPDATED
import React, { useState, useRef, useEffect } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import type { Category, Area, Ingredient } from '../../types/recipe.types';

interface RecipeFiltersProps {
  categories: Category[];
  areas: Area[];
  ingredients: Ingredient[];
  selectedCategory: string | null;
  selectedArea: string | null;
  selectedIngredient: string | null;
  onCategoryChange: (category: string | null) => void;
  onAreaChange: (area: string | null) => void;
  onIngredientChange: (ingredient: string | null) => void;
  onClearFilters: () => void;
  className?: string;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  categories,
  areas,
  ingredients,
  selectedCategory,
  selectedArea,
  selectedIngredient,
  onCategoryChange,
  onAreaChange,
  onIngredientChange,
  onClearFilters,
  className = '',
}) => {
  const [openDropdown, setOpenDropdown] = useState<'category' | 'area' | 'ingredient' | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const ingredientRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = selectedCategory || selectedArea || selectedIngredient;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (categoryRef.current && !categoryRef.current.contains(event.target as Node)) &&
        (areaRef.current && !areaRef.current.contains(event.target as Node)) &&
        (ingredientRef.current && !ingredientRef.current.contains(event.target as Node))
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: 'category' | 'area' | 'ingredient') => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const FilterDropdown = ({
    title,
    items,
    selected,
    onSelect,
    isOpen,
    onToggle,
    ref,
  }: {
    title: string;
    items: Array<{ strCategory?: string; strArea?: string; strIngredient?: string }>;
    selected: string | null;
    onSelect: (value: string | null) => void;
    isOpen: boolean;
    onToggle: () => void;
    ref: any;
  }) => {
    const getItemLabel = (item: any) => 
      item.strCategory || item.strArea || item.strIngredient;

    return (
      <div ref={ref} className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          rightIcon={<ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selected || title}
          </span>
        </Button>

        {isOpen && (
          <div className="dropdown left-0 right-0 top-full min-w-[200px] max-h-64 overflow-y-auto">
            <div
              className="dropdown-item cursor-pointer hover:bg-secondary-50"
              onClick={() => {
                onSelect(null);
                setOpenDropdown(null);
              }}
            >
              <div className="flex items-center justify-between">
                All {title.toLowerCase()}s
                {!selected && <Check className="h-4 w-4 text-primary-600" />}
              </div>
            </div>
            
            {items.map((item) => {
              const label = getItemLabel(item);
              if (!label) return null;
              
              const isSelected = selected === label;
              
              return (
                <div
                  key={label}
                  className="dropdown-item cursor-pointer"
                  onClick={() => {
                    onSelect(label);
                    setOpenDropdown(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    {label}
                    {isSelected && <Check className="h-4 w-4 text-primary-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-primary-50 p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Active filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge
                variant="primary"
                rightIcon={<X className="h-3 w-3" />}
                onClick={() => onCategoryChange(null)}
                className="cursor-pointer hover:bg-primary-200"
              >
                {selectedCategory}
              </Badge>
            )}
            
            {selectedArea && (
              <Badge
                variant="secondary"
                rightIcon={<X className="h-3 w-3" />}
                onClick={() => onAreaChange(null)}
                className="cursor-pointer hover:bg-secondary-200"
              >
                {selectedArea}
              </Badge>
            )}
            
            {selectedIngredient && (
              <Badge
                variant="accent"
                rightIcon={<X className="h-3 w-3" />}
                onClick={() => onIngredientChange(null)}
                className="cursor-pointer hover:bg-accent-200"
              >
                {selectedIngredient}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
            rightIcon={<X className="h-4 w-4" />}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterDropdown
          title="Category"
          items={categories}
          selected={selectedCategory}
          onSelect={onCategoryChange}
          isOpen={openDropdown === 'category'}
          onToggle={() => toggleDropdown('category')}
          ref={categoryRef}
        />
        
        <FilterDropdown
          title="Cuisine Area"
          items={areas}
          selected={selectedArea}
          onSelect={onAreaChange}
          isOpen={openDropdown === 'area'}
          onToggle={() => toggleDropdown('area')}
          ref={areaRef}
        />
        
        <FilterDropdown
          title="Ingredient"
          items={ingredients}
          selected={selectedIngredient}
          onSelect={onIngredientChange}
          isOpen={openDropdown === 'ingredient'}
          onToggle={() => toggleDropdown('ingredient')}
          ref={ingredientRef}
        />
      </div>
    </div>
  );
};

export default RecipeFilters;