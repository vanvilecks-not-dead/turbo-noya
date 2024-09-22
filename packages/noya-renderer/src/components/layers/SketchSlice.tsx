import Sketch from '@repo/noya-file-format';
import { useDeletable } from '@repo/noya-react-canvaskit';
import { Primitives } from '@repo/noya-state';
import { memo, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Rect } from '../../ComponentsContext';
import { useCanvasKit } from '../../hooks/useCanvasKit';
import { useRenderingMode } from '../../RenderingModeContext';

interface Props {
  layer: Sketch.Slice;
}

export default memo(function SketchSlice({ layer }: Props) {
  const renderingMode = useRenderingMode();
  const CanvasKit = useCanvasKit();
  const primaryColor = useTheme().colors.canvas.sliceOutline;

  const paint = useMemo(() => {
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.parseColorString(primaryColor));
    paint.setPathEffect(CanvasKit.PathEffect.MakeDash([4, 2]));
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(1);
    return paint;
  }, [CanvasKit, primaryColor]);

  useDeletable(paint);

  const rect = Primitives.rect(CanvasKit, layer.frame);

  if (renderingMode === 'static') return null;

  return <Rect paint={paint} rect={rect} />;
});
