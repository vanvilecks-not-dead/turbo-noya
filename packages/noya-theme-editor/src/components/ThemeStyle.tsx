import Sketch from '@repo/noya-file-format';
import { center, Size } from '@repo/noya-geometry';
import { SketchLayer } from '@repo/noya-renderer';
import { SketchModel } from '@repo/noya-sketch-model';
import React, { memo, useMemo } from 'react';
import { CanvasPreviewItem } from './CanvasPreviewItem';

interface Props {
  style: Sketch.Style;
}

const PREVIEW_SIZE = 60;

function RCKStylePreview({ style, size }: { style: Sketch.Style; size: Size }) {
  const layer = useMemo(() => {
    return SketchModel.rectangle({
      fixedRadius: 6,
      frame: SketchModel.rect(
        center({ width: PREVIEW_SIZE, height: PREVIEW_SIZE }, size),
      ),
      style,
    });
  }, [style, size]);

  return <SketchLayer layer={layer} />;
}

export const ThemeStyle = memo(function ThemeStyle({ style }: Props) {
  return (
    <CanvasPreviewItem
      renderContent={(size) => <RCKStylePreview style={style} size={size} />}
    />
  );
});
