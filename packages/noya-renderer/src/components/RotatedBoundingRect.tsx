import { useApplicationState } from '@repo/noya-app-state-context';
import Sketch from '@repo/noya-file-format';
import { useDeletable, useFill } from '@repo/noya-react-canvaskit';
import { Primitives, Selectors } from '@repo/noya-state';
import { memo, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { Path } from '../ComponentsContext';
import { useCanvasKit } from '../hooks/useCanvasKit';
import { useZoom } from '../ZoomContext';

export const RotatedBoundingRect = memo(function RotatedBoundingRect({
  layerId,
}: {
  layerId: string;
}) {
  const CanvasKit = useCanvasKit();
  const [state] = useApplicationState();
  const {
    canvas: { selectionStroke },
  } = useTheme().colors;
  const zoom = useZoom();

  const strokeWidth = 2 / zoom;
  const paint = useFill({
    color: selectionStroke,
    strokeWidth,
  });

  const page = Selectors.getCurrentPage(state);
  const boundingPoints = useMemo(
    () =>
      Selectors.getBoundingPoints(page, layerId, {
        groups: 'childrenOnly',
        includeHiddenLayers: true,
      }),
    [page, layerId],
  );

  const path = useMemo(() => {
    const path = new CanvasKit.Path();

    if (boundingPoints.length === 0) return path;

    path.moveTo(boundingPoints[0].x, boundingPoints[0].y);
    path.lineTo(boundingPoints[1].x, boundingPoints[1].y);
    path.lineTo(boundingPoints[2].x, boundingPoints[2].y);
    path.lineTo(boundingPoints[3].x, boundingPoints[3].y);
    path.close();

    const outer = Primitives.getStrokedBorderPath(
      CanvasKit,
      path,
      strokeWidth / 2,
      Sketch.BorderPosition.Inside,
      Sketch.LineCapStyle.Butt,
      Sketch.LineJoinStyle.Miter,
    );

    path.delete();

    return outer;
  }, [CanvasKit, boundingPoints, strokeWidth]);

  useDeletable(path);

  return <Path path={path} paint={paint} />;
});
