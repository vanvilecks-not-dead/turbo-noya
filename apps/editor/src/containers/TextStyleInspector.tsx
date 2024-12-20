import { useApplicationState, useSelector } from '@repo/noya-app-state-context';
import { Divider } from '@repo/noya-designsystem';
import Sketch from '@repo/noya-file-format';
import { TextLayoutRow, TextOptionsRow, TextStyleRow } from '@repo/noya-inspector';
import { useDeepMemo, useShallowArray } from '@repo/noya-react-utils';
import { getEditableTextStyle, getMultiValue, Selectors } from '@repo/noya-state';
import React, { memo, useCallback, useMemo } from 'react';
export default memo(function TextStyleInspector() {
  const [state, dispatch] = useApplicationState();

  const selectedText = useDeepMemo(Selectors.getTextSelection(state));

  const textLayers = useShallowArray(
    useSelector(Selectors.getSelectedTextLayers),
  );

  const stringAttributes = useMemo(
    () =>
      selectedText
        ? Selectors.getAttributesInRange(textLayers[0].attributedString, [
            selectedText.range.anchor,
            selectedText.range.head,
          ])
        : textLayers
            .map((layer) => layer.attributedString)
            .flatMap((attributedString) => attributedString.attributes),
    [selectedText, textLayers],
  );

  const textBehavior = getMultiValue(
    textLayers.map((layer) => layer.textBehaviour),
  );

  const selectedStyles = useShallowArray(
    useSelector(Selectors.getSelectedStyles),
  );

  const textStyles = useShallowArray(
    selectedStyles.flatMap((style) =>
      style.textStyle ? [style.textStyle] : [],
    ),
  );

  const editableTextStyle = useMemo(
    () =>
      getEditableTextStyle(
        selectedText ? [] : textStyles,
        stringAttributes.map((string) => string.attributes),
      ),
    [stringAttributes, selectedText, textStyles],
  );

  return (
    <>
      <TextStyleRow
        fontFamily={editableTextStyle.fontFamily}
        fontTraits={editableTextStyle.fontTraits}
        fontSize={editableTextStyle.fontSize}
        fontColor={editableTextStyle.fontColor}
        letterSpacing={editableTextStyle.letterSpacing}
        lineSpacing={editableTextStyle.lineSpacing}
        paragraphSpacing={editableTextStyle.paragraphSpacing}
        onChangeFontName={useCallback(
          (value) => dispatch('setTextFontName', value),
          [dispatch],
        )}
        onChangeFontColor={useCallback(
          (value) => dispatch('setTextColor', value),
          [dispatch],
        )}
        onChangeFontSize={useCallback(
          (value, mode) => dispatch('setTextFontSize', value, mode),
          [dispatch],
        )}
        onChangeLineSpacing={useCallback(
          (value, mode) => dispatch('setTextLetterSpacing', value, mode),
          [dispatch],
        )}
        onChangeLetterSpacing={useCallback(
          (value, mode) => dispatch('setTextLineSpacing', value, mode),
          [dispatch],
        )}
        onChangeParagraphSpacing={useCallback(
          (value, mode) => dispatch('setTextParagraphSpacing', value, mode),
          [dispatch],
        )}
      />
      <Divider />
      <TextLayoutRow
        textLayout={textBehavior}
        textVerticalAlignment={editableTextStyle.verticalAlignment}
        textHorizontalAlignment={editableTextStyle.horizontalAlignment}
        onChangeTextLayout={useCallback(
          (value: Sketch.TextBehaviour) => {
            dispatch('setTextAlignment', value);
          },
          [dispatch],
        )}
        onChangeTextHorizontalAlignment={useCallback(
          (value: Sketch.TextHorizontalAlignment) => {
            dispatch('setTextHorizontalAlignment', value);
          },
          [dispatch],
        )}
        onChangeTextVerticalAlignment={useCallback(
          (value: Sketch.TextVerticalAlignment) => {
            dispatch('setTextVerticalAlignment', value);
          },
          [dispatch],
        )}
      />
      <Divider />
      <TextOptionsRow
        textTransform={editableTextStyle.textTransform}
        textDecoration={editableTextStyle.textDecoration}
        onChangeTextDecoration={useCallback(
          (value) => dispatch('setTextDecoration', value),
          [dispatch],
        )}
        onChangeTextTransform={useCallback(
          (value) => dispatch('setTextTransform', value),
          [dispatch],
        )}
      />
    </>
  );
});
