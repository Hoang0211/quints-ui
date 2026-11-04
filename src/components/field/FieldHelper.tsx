import type { ReactNode } from "react";
import { cx } from "../../utils/cx";

interface FieldHelperProps {
  /** The form component's BEM block, e.g. "q-text-field" renders `q-text-field__helper`. */
  block: string;
  id: string;
  error?: boolean;
  children?: ReactNode;
}

// The helper/error text under a form control, rendered only when there is text to show.
// Class names stay per component (`${block}__helper`) so consumer CSS overrides keep working.
export function FieldHelper({ block, id, error = false, children }: FieldHelperProps) {
  if (!children) return null;

  return (
    <div id={id} className={cx(`${block}__helper`, error && `${block}__helper--error`)}>
      {children}
    </div>
  );
}
