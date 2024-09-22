import { useDispatch, useSelector } from '@repo/noya-app-state-context';
import { Divider, withSeparatorElements } from '@repo/noya-designsystem';
import Sketch from '@repo/noya-file-format';
import { LinkedSymbolRow, SymbolInstanceOverridesRow } from '@repo/noya-inspector';
import { useShallowArray } from '@repo/noya-react-utils';
import { Selectors } from '@repo/noya-state';
import React, { memo, useCallback } from 'react';
import FillInspector from './FillInspector';

export default memo(function SymbolMasterInspector() {
  const dispatch = useDispatch();

  const selectedSymbolInstance = useShallowArray(
    useSelector(Selectors.getSelectedLayers),
  )[0] as Sketch.SymbolInstance;

  const symbolMaster = useShallowArray(useSelector(Selectors.getSymbols)).find(
    (symbol: Sketch.SymbolMaster) =>
      symbol.symbolID === selectedSymbolInstance.symbolID,
  );

  const onSetOverrideValue = useCallback(
    (overrideName: string, value: string) => {
      dispatch(
        'setOverrideValue',
        undefined,
        overrideName,
        value === '' ? undefined : value,
      );
    },
    [dispatch],
  );

  const onResetOverrideValue = useCallback(() => {
    dispatch('setOverrideValue', undefined);
  }, [dispatch]);

  const elements = [
    <LinkedSymbolRow
      symbolId={selectedSymbolInstance.symbolID}
      onSelect={useCallback(
        (value) => {
          dispatch('setSymbolInstanceSource', value, 'resetToMaster');
        },
        [dispatch],
      )}
      onDetach={useCallback(
        () => dispatch('detachSymbol', selectedSymbolInstance.do_objectID),
        [dispatch, selectedSymbolInstance.do_objectID],
      )}
      onEditSource={useCallback(
        () => dispatch('goToSymbolSource', selectedSymbolInstance.symbolID),
        [dispatch, selectedSymbolInstance.symbolID],
      )}
    />,
    <FillInspector title={'Tint'} allowMoreThanOne={false} />,
    symbolMaster && (
      <SymbolInstanceOverridesRow
        overrideValues={selectedSymbolInstance.overrideValues}
        symbolMaster={symbolMaster}
        onSetOverrideValue={onSetOverrideValue}
        onResetOverrideValue={onResetOverrideValue}
      />
    ),
  ];

  return <>{withSeparatorElements(elements, <Divider />)}</>;
});
