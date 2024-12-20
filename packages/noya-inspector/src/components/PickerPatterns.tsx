import { Divider, PatternPreviewBackground, Select } from '@repo/noya-designsystem';
import Sketch from '@repo/noya-file-format';
import  { memo, useCallback } from 'react';
import { useTheme } from 'styled-components';
import * as InspectorPrimitives from './InspectorPrimitives';
import { GridSmall, Square } from './PickerAssetGrid';

const PatternSquare = memo(
  ({
    item,
    onClick,
  }: {
    item: Sketch.FileRef | Sketch.DataRef;
    onClick: (file: Sketch.FileRef | Sketch.DataRef) => void;
  }) => {
    const { inputBackground } = useTheme().colors;

    return (
      <Square
        background={inputBackground}
        onClick={useCallback(() => onClick(item), [item, onClick])}
      >
        <PatternPreviewBackground
          imageRef={item}
          fillType={Sketch.PatternFillType.Fit}
          tileScale={1}
        />
      </Square>
    );
  },
);

interface Props {
  imageAssets: (Sketch.FileRef | Sketch.DataRef)[];
  onChange: (file: Sketch.FileRef | Sketch.DataRef) => void;
}

export const PickerPatterns = memo(function PickerPatterns({
  imageAssets,
  onChange,
}: Props) {
  return (
    <>
      <Divider />
      <InspectorPrimitives.Section>
        <InspectorPrimitives.Row>
          <Select
            id="document-images"
            options={['Document Images']}
            value="Document Images"
            onChange={() => {}}
          />
        </InspectorPrimitives.Row>
      </InspectorPrimitives.Section>
      {imageAssets.length > 0 && (
        <InspectorPrimitives.Section>
          <GridSmall>
            {imageAssets.map((item) => (
              <PatternSquare key={item._ref} item={item} onClick={onChange} />
            ))}
          </GridSmall>
        </InspectorPrimitives.Section>
      )}
    </>
  );
});
