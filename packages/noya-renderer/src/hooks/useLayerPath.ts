import { CanvasKit } from '@repo/canvaskit';
import Sketch from '@repo/noya-file-format';
import { useDeletable } from '@repo/noya-react-canvaskit';
import { Layers, Primitives } from '@repo/noya-state';
import { useMemo } from 'react';
import { getCombinedLayerPaths } from '../utils/getCombinedLayerPaths';
import { useCanvasKit } from './useCanvasKit';

export function getLayerPath(
  CanvasKit: CanvasKit,
  layer: Layers.PointsLayer | Sketch.ShapeGroup,
) {
  const path = Layers.isShapeGroup(layer)
    ? getCombinedLayerPaths(CanvasKit, layer)
    : Primitives.path(CanvasKit, layer.points, layer.frame, layer.isClosed);

  path.setFillType(
    Primitives.pathFillType(CanvasKit, layer.style!.windingRule),
  );

  return path;
}

export default function useLayerPath(
  layer: Layers.PointsLayer | Sketch.ShapeGroup,
) {
  const CanvasKit = useCanvasKit();

  const path = useMemo(
    () => getLayerPath(CanvasKit, layer),
    [CanvasKit, layer],
  );

  useDeletable(path);

  return path;
}
