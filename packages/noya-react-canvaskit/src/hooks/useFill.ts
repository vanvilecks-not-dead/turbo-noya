import { Paint } from '@repo/canvaskit';
import { useCanvasKit } from '@repo/noya-renderer';
import { useMemo } from 'react';
import { ColorParameters } from './useColor';
import usePaint, { PaintParameters } from './usePaint';

export function useFill(parameters: Omit<PaintParameters, 'style'>): Paint {
  const CanvasKit = useCanvasKit();

  const parametersWithStyle = useMemo(
    () => ({
      ...parameters,
      style: CanvasKit.PaintStyle.Fill,
    }),
    [CanvasKit.PaintStyle.Fill, parameters],
  );

  return usePaint(parametersWithStyle);
}

export function useColorFill(color: ColorParameters): Paint {
  const CanvasKit = useCanvasKit();

  const parametersWithStyle = useMemo(
    () => ({
      color,
      style: CanvasKit.PaintStyle.Fill,
    }),
    [CanvasKit.PaintStyle.Fill, color],
  );

  return usePaint(parametersWithStyle);
}
