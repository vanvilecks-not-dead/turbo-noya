import * as CanvasKit from '@repo/canvaskit';
import Sketch from '@repo/noya-file-format';
import { Rect } from '@repo/noya-geometry';
import { useDeletable } from '@repo/noya-react-canvaskit';
import { Primitives } from '@repo/noya-state';
import  { memo, useMemo } from 'react';
import { Path } from '../../ComponentsContext';
import { useCanvasKit } from '../../hooks/useCanvasKit';

export default memo(function SketchBorder({
  path,
  frame,
  border,
  borderOptions,
}: {
  path: CanvasKit.Path;
  frame: Rect;
  border: Sketch.Border;
  borderOptions: Sketch.BorderOptions;
}) {
  const CanvasKit = useCanvasKit();

  const paint = useMemo(
    () => Primitives.fill(CanvasKit, border, frame),
    [CanvasKit, border, frame],
  );

  const strokedPath = useMemo(
    () =>
      Primitives.getStrokedBorderPath(
        CanvasKit,
        path,
        border.thickness,
        border.position,
        borderOptions.lineCapStyle,
        borderOptions.lineJoinStyle,
      ),
    [
      CanvasKit,
      border.position,
      border.thickness,
      borderOptions.lineCapStyle,
      borderOptions.lineJoinStyle,
      path,
    ],
  );

  useDeletable(strokedPath);

  return <Path path={strokedPath} paint={paint} />;
});
