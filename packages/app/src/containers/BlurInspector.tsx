import { useApplicationState, useSelector } from '@repo/noya-app-state-context';
import { BlurRow, EnableableElementController } from '@repo/noya-inspector';
import { useShallowArray } from '@repo/noya-react-utils';
import { SketchModel } from '@repo/noya-sketch-model';
import { Layers, Selectors, SetNumberMode } from '@repo/noya-state';
import React, { memo, useCallback, useMemo } from 'react';
import { saturationInterpolator } from './ColorControlsInspector';

export default memo(function BlurInspector() {
  const [state, dispatch] = useApplicationState();

  const selectedLayers = Selectors.getSelectedLayers(state).filter(
    Layers.hasInspectableBlur,
  );

  // Bitmap & text layers don't support background blur
  const supportsBackgroundBlur =
    selectedLayers.filter(
      (layer) => Layers.isBitmapLayer(layer) || Layers.isTextLayer(layer),
    ).length === 0;

  const selectedStyles = useShallowArray(
    useSelector(Selectors.getSelectedStyles),
  );

  const blurs = useMemo(
    () => selectedStyles.flatMap((style) => (style.blur ? [style.blur] : [])),
    [selectedStyles],
  );

  const firstBlur = useMemo(
    () =>
      blurs[0] ??
      SketchModel.blur({
        isEnabled: false,
      }),
    [blurs],
  );

  return (
    <EnableableElementController
      id="blur-inspector"
      title="Blur"
      isEnabled={firstBlur.isEnabled}
      onChangeIsEnabled={useCallback(
        (isEnabled) => dispatch('setBlurEnabled', isEnabled),
        [dispatch],
      )}
    >
      <BlurRow
        id="blur-row"
        supportedBlurTypes={useMemo(
          () =>
            supportsBackgroundBlur ? ['Gaussian', 'Background'] : ['Gaussian'],
          [supportsBackgroundBlur],
        )}
        blurType={firstBlur.type}
        blurRadius={firstBlur.radius ?? 0}
        blurSaturation={saturationInterpolator.toDisplay(firstBlur.saturation)}
        onChangeBlurType={useCallback(
          (value) => dispatch('setBlurType', value),
          [dispatch],
        )}
        onChangeBlurRadius={useCallback(
          (value, mode) => dispatch('setBlurRadius', value, mode),
          [dispatch],
        )}
        onChangeBlurSaturation={useCallback(
          (value: number, mode: SetNumberMode) =>
            dispatch(
              'setBlurSaturation',
              mode === 'adjust'
                ? value / 100
                : saturationInterpolator.fromDisplay(value),
              mode,
            ),
          [dispatch],
        )}
      />
    </EnableableElementController>
  );
});
