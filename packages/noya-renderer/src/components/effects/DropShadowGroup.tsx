import Sketch from '@repo/noya-file-format';
import { DropShadow } from '@repo/noya-react-canvaskit';
import { Primitives } from '@repo/noya-state';
import { memo, ReactNode, useMemo } from 'react';
import { Group } from '../../ComponentsContext';
import { useCanvasKit } from '../../hooks/useCanvasKit';

interface Props {
  shadow: Sketch.Shadow;
  children: ReactNode;
}

export default memo(function DropShadowGroup({ shadow, children }: Props) {
  const CanvasKit = useCanvasKit();

  const imageFilter = useMemo(
    (): DropShadow => ({
      type: 'dropShadow',
      color: Primitives.color(CanvasKit, shadow.color),
      offset: { x: shadow.offsetX, y: shadow.offsetY },
      radius: shadow.blurRadius / 2,
    }),
    [CanvasKit, shadow],
  );

  return <Group imageFilter={imageFilter}>{children}</Group>;
});
