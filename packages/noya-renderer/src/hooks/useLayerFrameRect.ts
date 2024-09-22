import Sketch from '@repo/noya-file-format';
import { Primitives } from '@repo/noya-state';
import { useMemo } from 'react';
import { useCanvasKit } from './useCanvasKit';

export default function useLayerFrameRect(layer: Sketch.AnyLayer) {
  const CanvasKit = useCanvasKit();

  return useMemo(() => {
    return Primitives.rect(CanvasKit, layer.frame);
  }, [CanvasKit, layer]);
}
