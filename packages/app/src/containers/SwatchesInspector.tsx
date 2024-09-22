import { useApplicationState, useSelector } from '@repo/noya-app-state-context';
import { Divider } from '@repo/noya-designsystem';
import { ColorInspector, NameInspector } from '@repo/noya-inspector';
import { useShallowArray } from '@repo/noya-react-utils';
import { getMultiValue, Selectors } from '@repo/noya-state';
import { delimitedPath, isDeepEqual } from '@repo/noya-utils';
import React, { memo, useCallback } from 'react';

export default memo(function SwatchesInspectors() {
  const [state, dispatch] = useApplicationState();

  const selectedSwatches = useShallowArray(
    useSelector(Selectors.getSelectedSwatches),
  );
  const ids = state.selectedThemeTab.swatches.ids;
  const color = getMultiValue(
    selectedSwatches.map((swatch) => swatch.value),
    isDeepEqual,
  );

  const handleNameChange = useCallback(
    (value: string) =>
      dispatch(
        'setSwatchName',
        selectedSwatches.map((v) => v.do_objectID),
        value,
      ),
    [dispatch, selectedSwatches],
  );

  const handleSetOpacity = useCallback(
    (value, mode) => dispatch('setSwatchOpacity', ids, value, mode),
    [dispatch, ids],
  );

  const handleChangeColor = useCallback(
    (value) => dispatch('setSwatchColor', ids, value),
    [dispatch, ids],
  );

  if (selectedSwatches.length === 0) return null;

  return (
    <>
      <NameInspector
        names={selectedSwatches.map((v) => delimitedPath.basename(v.name))}
        onNameChange={handleNameChange}
      />
      <Divider />
      <ColorInspector
        id={'color-swatch'}
        color={color}
        onSetOpacity={handleSetOpacity}
        onChangeColor={handleChangeColor}
      />
    </>
  );
});
