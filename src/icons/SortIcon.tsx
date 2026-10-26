import type { SVGProps } from "react";

export interface SortIconProps extends SVGProps<SVGSVGElement> {
  direction: "asc" | "desc" | "none";
}

/** Stacked up/down chevrons; the active direction is drawn solid, the other faded. */
export function SortIcon({ direction, ...props }: SortIconProps) {
  const upOpacity = direction === "asc" ? 1 : 0.35;
  const downOpacity = direction === "desc" ? 1 : 0.35;

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M5 6.5l3-3 3 3"
        fill="none"
        stroke="currentColor"
        strokeOpacity={upOpacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.5l3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeOpacity={downOpacity}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
