import { AffineTransform } from '@repo/noya-geometry';
import { useMemo } from 'react';
import { useRootScale } from '../RootScaleContext';

export function useRootScaleTransform() {
  const rootScale = useRootScale();
  const rootScaleTransform = useMemo(
    () => AffineTransform.scale(rootScale),
    [rootScale],
  );
  return rootScaleTransform;
}
