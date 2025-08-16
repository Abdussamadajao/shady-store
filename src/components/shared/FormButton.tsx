import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg";
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className,
  disabled,
  ...props
}) => {
  const { formState: { isSubmitting } } = useFormContext();
  const isDisabled = disabled || isSubmitting;

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-secondary text-white hover:bg-secondary-100",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };

  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-8"
  };

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "w-full",
        className
      )}
      {...props}
    >
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default FormButton;
