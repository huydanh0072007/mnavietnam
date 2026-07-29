import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-sm';
    
    const variants = {
      primary: 'bg-[#C4A35A] text-[#1A1A2E] hover:bg-[#a38541] focus:ring-[#C4A35A]',
      secondary: 'border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-[#C4A35A] focus:ring-[#1A1A2E]',
      ghost: 'text-[#E8E6E1] hover:bg-[#0F1D2F] hover:text-white focus:ring-[#0F1D2F]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-8 text-base',
      lg: 'h-14 px-10 text-lg',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
    const Comp = asChild ? Slot : "button";

    return (
      <Comp ref={ref} className={classes} {...props} />
    );
  }
);
Button.displayName = 'Button';
