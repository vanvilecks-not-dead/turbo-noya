import { useApplicationState, useWorkspace } from '@repo/noya-app-state-context';
import Sketch from '@repo/noya-file-format';
import { AffineTransform } from '@repo/noya-geometry';
import { useFill } from '@repo/noya-react-canvaskit';
import { Primitives, Selectors } from '@repo/noya-state';
import { memo, useMemo } from 'react';
import { Group, Rect } from '../../ComponentsContext';
import { useCanvasKit } from '../../hooks/useCanvasKit';
import { useTintColorFilter } from '../../hooks/useTintColorFilter';
import SketchGroup from './SketchGroup';
import { BaseLayerProps } from './types';

interface SymbolProps extends BaseLayerProps {
  layer: Sketch.SymbolInstance;
  symbolMaster: Sketch.SymbolMaster;
  layerStyles: Sketch.SharedStyleContainer;
  layerTextStyles: Sketch.SharedTextStyleContainer;
  wireframe?: boolean;
}

const Symbol = memo(function Symbol({
  layer,
  symbolMaster,
  layerStyles,
  layerTextStyles,
  wireframe,
  SketchLayer,
}: SymbolProps) {
  const CanvasKit = useCanvasKit();

  const backgroundFillProperties = useMemo(
    () => ({
      color: Primitives.color(CanvasKit, symbolMaster.backgroundColor),
    }),
    [CanvasKit, symbolMaster.backgroundColor],
  );
  const fill = useFill(backgroundFillProperties);

  const rect = useMemo(
    () => Primitives.rect(CanvasKit, symbolMaster.frame),
    [CanvasKit, symbolMaster.frame],
  );

  const transform = useMemo(
    () =>
      AffineTransform.translate(
        layer.frame.x - symbolMaster.frame.x,
        layer.frame.y - symbolMaster.frame.y,
      ),
    [layer.frame, symbolMaster.frame],
  );

  const overriddenSymbolMaster = useMemo(
    () =>
      Selectors.applyOverrides({
        overrideValues: layer.overrideValues,
        symbolMaster,
        layerStyles,
        layerTextStyles,
      }),
    [layer.overrideValues, symbolMaster, layerStyles, layerTextStyles],
  );

  const opacity = layer.style?.contextSettings?.opacity ?? 1;

  const firstFill = layer.style?.fills?.[0];
  const tintColor =
    firstFill && firstFill.isEnabled ? firstFill.color : undefined;
  const colorFilter = useTintColorFilter(tintColor);

  if (wireframe) return null;

  return (
    <Group transform={transform} opacity={opacity} colorFilter={colorFilter}>
      {overriddenSymbolMaster.includeBackgroundColorInInstance && (
        <Rect paint={fill} rect={rect} />
      )}
      <SketchGroup SketchLayer={SketchLayer} layer={overriddenSymbolMaster} />
    </Group>
  );
});

interface Props extends BaseLayerProps {
  layer: Sketch.SymbolInstance;
}

export default memo(function SketchSymbolInstance({
  layer,
  SketchLayer,
}: Props) {
  const {
    preferences: { wireframeMode },
  } = useWorkspace();
  const [state] = useApplicationState();

  const symbolMaster = useMemo(
    () => Selectors.getSymbolMaster(state, layer.symbolID),
    [layer.symbolID, state],
  );

  if (!symbolMaster) return null;

  return (
    <Symbol
      layer={layer}
      symbolMaster={symbolMaster}
      layerStyles={state.sketch.document.layerStyles}
      layerTextStyles={state.sketch.document.layerTextStyles}
      SketchLayer={SketchLayer}
      wireframe={wireframeMode}
    />
  );
});
