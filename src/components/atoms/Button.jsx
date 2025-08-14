import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm",
    outline: "border border-primary-500 text-primary-500 hover:bg-primary-50",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-error-500 hover:bg-red-600 text-white shadow-md"
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm font-medium",
    sm: "h-8 px-3 py-1.5 text-xs font-medium",
    lg: "h-12 px-6 py-3 text-base font-medium",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;