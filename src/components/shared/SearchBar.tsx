import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  className,
  value,
  onChange,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  autoFocus = false,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange?.("");
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            } else {
              onSearch?.(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          className="pl-10 pr-10 font-inter"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      {onSearch && (
        <Button
          type="button"
          onClick={() => onSearch(value)}
          disabled={disabled || !value?.trim()}
          className="ml-2 font-poppins"
        >
          Search
        </Button>
      )}
    </div>
  );
};
