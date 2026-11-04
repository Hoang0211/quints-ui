import { useId } from "react";

interface UseFieldOptions {
  id?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

// The id and aria wiring every form control shares: a stable control id, and the
// helper text — or, when in error, the error message — that describes the control.
// Spread controlProps before the consumer's own props so their aria-* can still win.
export function useField({ id, helperText, error = false, errorMessage }: UseFieldOptions) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const helperId = `${controlId}-helper`;
  const helperContent = error && errorMessage ? errorMessage : helperText;

  return {
    controlId,
    controlProps: {
      id: controlId,
      "aria-invalid": error || undefined,
      "aria-describedby": helperContent ? helperId : undefined,
    },
    helperProps: { id: helperId, error, children: helperContent },
  };
}
