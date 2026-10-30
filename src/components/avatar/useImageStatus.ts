import { useCallback, useState } from "react";

// Tracks which src loaded/failed rather than a single status flag, so a
// new src automatically starts over without resetting state in an effect.
export function useImageStatus(src: string | undefined) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // An image that finished loading before React attached onLoad (cached, or
  // during hydration) never fires the event, so check on mount too.
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) {
      setLoadedSrc(image.getAttribute("src"));
    }
  }, []);

  return {
    isLoaded: src !== undefined && loadedSrc === src,
    hasFailed: src !== undefined && failedSrc === src,
    imageRef,
    handleLoad: () => setLoadedSrc(src ?? null),
    handleError: () => setFailedSrc(src ?? null),
  };
}
