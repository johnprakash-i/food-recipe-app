// src/components/layout/Container.tsx
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
  id?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = '7xl',
  padding = true,
  className = '',
  as: Component = 'div',
  id,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <Component
      id={id}
      className={`
        mx-auto 
        ${maxWidthClasses[maxWidth]} 
        ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Container;