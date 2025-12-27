import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <label className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className="peer sr-only"
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center',
            className,
          )}
        >
          <Check className="h-3 w-3 opacity-0 peer-checked:opacity-100 text-primary-foreground" />
        </div>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
