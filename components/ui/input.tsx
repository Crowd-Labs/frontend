import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 h-10 w-full rounded-md border border-input px-3 py-2",
          className
        )}
      >
        {icon}
        <input
          type={type}
          className={cn(
            "flex-1 bg-transparent text-sm border-0 file:text-sm file:font-medium placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
