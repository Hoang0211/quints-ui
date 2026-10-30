import { useEffect } from "react";

// Reports `id` to a parent while the calling component is mounted and clears it
// on unmount, so the parent only references an element (e.g. via aria-labelledby)
// that actually exists.
export function useRegisterId(
  register: ((id: string | null) => void) | undefined,
  id: string | undefined,
) {
  useEffect(() => {
    if (!register || !id) return;
    register(id);
    return () => register(null);
  }, [register, id]);
}
