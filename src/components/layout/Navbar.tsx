// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';

import { Heart, Home, Search } from 'lucide-react';
import { useRecipeContext } from '../../context/useRecipeContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useRecipeContext();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
              <span className="text-lg font-bold text-white">🍽</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Recipe<span className="text-primary-600">Hub</span>
              </h1>
              <p className="text-xs text-secondary-500">Find & cook amazing meals</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/favorites"
              className="relative flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Search className="h-4 w-4" />}
              onClick={() => document.getElementById('search-input')?.focus()}
            >
              Search Recipes
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate('/favorites')}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {favorites.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('search-input')?.focus()}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;