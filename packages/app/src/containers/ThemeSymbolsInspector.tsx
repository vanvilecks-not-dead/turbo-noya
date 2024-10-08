import { useApplicationState, useSelector } from '@repo/noya-app-state-context';
import { Divider, withSeparatorElements } from '@repo/noya-designsystem';
import { NameInspector } from '@repo/noya-inspector';
import { useShallowArray } from '@repo/noya-react-utils';
import { Selectors } from '@repo/noya-state';
import { delimitedPath } from '@repo/noya-utils';
import React, { memo, useCallback } from 'react';
import SymbolMasterInspector from './SymbolMasterInspector';

export default memo(function ThemeSymbolsInspector() {
  const [, dispatch] = useApplicationState();

  const selectedSymbols = useShallowArray(
    useSelector(Selectors.getSelectedSymbols),
  );

  const handleNameChange = useCallback(
    (value: string) =>
      dispatch(
        'setSymbolName',
        selectedSymbols.map((v) => v.do_objectID),
        value,
      ),
    [dispatch, selectedSymbols],
  );

  if (selectedSymbols.length === 0) return null;
  const showSymbolsInspector = selectedSymbols.length === 1;

  const elements = [
    <NameInspector
      names={selectedSymbols.map((v) => delimitedPath.basename(v.name))}
      onNameChange={handleNameChange}
    />,
    showSymbolsInspector && <SymbolMasterInspector />,
  ];

  return <>{withSeparatorElements(elements, <Divider />)}</>;
});
