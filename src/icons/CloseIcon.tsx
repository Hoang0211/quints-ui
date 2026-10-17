import type { SVGProps } from "react";

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
