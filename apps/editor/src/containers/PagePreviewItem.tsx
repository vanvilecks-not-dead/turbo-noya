import Sketch from '@repo/noya-file-format';
import { LayerPreview as RCKLayerPreview } from '@repo/noya-renderer';
import { Selectors } from '@repo/noya-state';
import { CanvasPreviewItem } from '@repo/noya-theme-editor';
import React, { memo, useCallback, useMemo } from 'react';

export type PageGridMenuItemType = 'duplicate' | 'delete' | 'rename';

interface PagePreviewItemProps {
  page: Sketch.Page;
  padding?: number;
}

export const PagePreviewItem = memo(function PageGridItem({
  page,
  padding = 0,
}: PagePreviewItemProps) {
  const frame = useMemo(
    () => Selectors.getPageContentBoundingRect(page),
    [page],
  );

  return (
    <CanvasPreviewItem
      renderContent={useCallback(
        (size) =>
          frame && (
            <RCKLayerPreview
              layer={page}
              layerFrame={frame}
              previewSize={size}
              scalingMode="down"
              padding={padding}
            />
          ),
        [frame, padding, page],
      )}
    />
  );
});
