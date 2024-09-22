import { useApplicationState, useSelector } from '@repo/noya-app-state-context';
import { Divider, withSeparatorElements } from '@repo/noya-designsystem';
import { NameInspector } from '@repo/noya-inspector';
import { useShallowArray } from '@repo/noya-react-utils';
import { Selectors } from '@repo/noya-state';
import { delimitedPath } from '@repo/noya-utils';
import React, { memo, useCallback } from 'react';
import BorderInspector from './BorderInspector';
import FillInspector from './FillInspector';
import OpacityInspector from './OpacityInspector';
import ShadowInspector from './ShadowInspector';
import TextStyleInspector from './TextStyleInspector';

export default memo(function ThemeTextStyleInspector() {
  const [, dispatch] = useApplicationState();

  const selectedStyles = useShallowArray(
    useSelector(Selectors.getSelectedThemeTextStyles),
  );

  const handleNameChange = useCallback(
    (value: string) =>
      dispatch(
        'setTextStyleName',
        selectedStyles.map((v) => v.do_objectID),
        value,
      ),
    [dispatch, selectedStyles],
  );

  if (selectedStyles.length === 0) return null;

  const elements = [
    <NameInspector
      names={selectedStyles.map((v) => delimitedPath.basename(v.name))}
      onNameChange={handleNameChange}
    />,
    <TextStyleInspector />,
    <OpacityInspector />,
    <FillInspector title="Fills" allowMoreThanOne />,
    <BorderInspector />,
    <ShadowInspector />,
  ];

  return <>{withSeparatorElements(elements, <Divider />)}</>;
});
