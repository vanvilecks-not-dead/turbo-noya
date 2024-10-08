import { BlurStyle, MaskFilter } from '@repo/canvaskit';
import { useCanvasKit } from '@repo/noya-renderer';
import { useMemo } from 'react';
import useDeletable from './useDeletable';

export type BlurMaskFilterParameters = {
  style: BlurStyle;
  sigma: number;
  respectCTM: boolean;
};

export default function useBlurMaskFilter(
  parameters: BlurMaskFilterParameters,
): MaskFilter {
  const CanvasKit = useCanvasKit();

  const maskFilter = useMemo(
    () =>
      CanvasKit.MaskFilter.MakeBlur(
        parameters.style,
        parameters.sigma,
        parameters.respectCTM,
      ),
    [
      CanvasKit.MaskFilter,
      parameters.respectCTM,
      parameters.sigma,
      parameters.style,
    ],
  );

  return useDeletable(maskFilter);
}
