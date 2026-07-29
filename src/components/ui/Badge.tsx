import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'buyout' | 'jv' | 'status' | 'default';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    const variants = {
      buyout: 'bg-[#DC2626] text-white',
      jv: 'bg-[#2563EB] text-white',
      status: 'bg-[#10B981] text-white',
      default: 'bg-gray-100 text-gray-800',
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`;

    return (
      <div ref={ref} className={classes} {...props} />
    );
  }
);
Badge.displayName = 'Badge';
