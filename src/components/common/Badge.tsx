import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva('badge', {
  variants: {
    variant: {
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      accent: 'badge-accent',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type BadgeElement = HTMLSpanElement | HTMLButtonElement;

export interface BadgeProps
  extends VariantProps<typeof badgeVariants> {
  as?: 'span' | 'button';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: React.ReactNode;
}

const Badge = React.forwardRef<BadgeElement, BadgeProps>(
  (
    {
      as = 'span',
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <Component
        ref={ref as any}
        className={badgeVariants({ variant, size, className })}
        {...(as === 'button' ? { type: 'button', onClick } : {})}
        {...props}
      >
        {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1.5">{rightIcon}</span>}
      </Component>
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;
