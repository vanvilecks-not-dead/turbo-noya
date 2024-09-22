import { useApplicationState } from '@repo/noya-app-state-context';
import { useStroke } from '@repo/noya-react-canvaskit';
import { Layers, Selectors } from '@repo/noya-state';
import  { memo } from 'react';
import { useTheme } from 'styled-components';
import { Path } from '../ComponentsContext';
import { useCanvasKit } from '../hooks/useCanvasKit';
import PseudoPoint from './PseudoPoint';

export const InsertPointOverlay = memo(function InsertPointOverlay() {
  const [state] = useApplicationState();
  const page = Selectors.getCurrentPage(state);
  const CanvasKit = useCanvasKit();
  const { primary } = useTheme().colors;
  const paint = useStroke({ color: primary });

  if (state.interactionState.type !== 'editPath') return null;

  const { point } = state.interactionState;

  if (!point) return null;

  const layers = Layers.findAll(
    page,
    (layer) => layer.do_objectID in state.selectedPointLists,
  ).filter(Layers.isPointsLayer);

  const layer = layers.find((layer) =>
    Selectors.layerPathContainsPoint(CanvasKit, layer, point),
  );

  if (!layer) return null;

  const splitParameters = Selectors.getSplitPathParameters(
    CanvasKit,
    layer,
    point,
  );

  if (!splitParameters) return null;

  const { segmentPath, pointOnPath } = splitParameters;

  return (
    <>
      <Path path={segmentPath} paint={paint} />
      <PseudoPoint point={pointOnPath} />
    </>
  );
});
