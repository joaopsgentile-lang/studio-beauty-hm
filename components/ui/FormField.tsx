import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, id, className, ...rest }: FormFieldProps) {
  const fieldId = id ?? rest.name;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-sm font-medium tracking-wide text-foreground"
      >
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={clsx(
          "mt-2 w-full rounded-xl border border-foreground/15 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-400",
          error && "border-red-400",
          className
        )}
        {...rest}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
