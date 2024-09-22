import Sketch from '@repo/noya-file-format';
import { useDeletable } from '@repo/noya-react-canvaskit';
import { Primitives } from '@repo/noya-state';
import { useMemo } from 'react';
import { useCanvasKit } from './useCanvasKit';

export function useTintColorFilter(tintColor: Sketch.Color | undefined) {
  const CanvasKit = useCanvasKit();

  const colorFilter = useMemo(() => {
    return tintColor
      ? CanvasKit.ColorFilter.MakeBlend(
          Primitives.color(CanvasKit, tintColor),
          CanvasKit.BlendMode.SrcIn,
        )
      : undefined;
  }, [CanvasKit, tintColor]);

  useDeletable(colorFilter);

  return colorFilter;
}
