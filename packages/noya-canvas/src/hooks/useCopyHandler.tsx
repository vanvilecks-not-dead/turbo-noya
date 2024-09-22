import { useApplicationState } from '@repo/noya-app-state-context';
import Sketch from '@repo/noya-file-format';
import { elementShouldHandleOwnShortcut } from '@repo/noya-keymap';
import { getSelectedLayers } from '@repo/noya-state';
import { ClipboardUtils } from '@repo/noya-utils';
import { useEffect } from 'react';

export type NoyaClipboardData = {
  type: 'layers';
  layers: Sketch.AnyLayer[];
};

export function useCopyHandler() {
  const [state, dispatch] = useApplicationState();
  const selectedLayers = getSelectedLayers(state);

  useEffect(() => {
    const handler = (event: ClipboardEvent) => {
      if (elementShouldHandleOwnShortcut(event.target)) return;

      event.preventDefault();

      if (selectedLayers.length === 0) return;

      const data: NoyaClipboardData = {
        type: 'layers',
        layers: selectedLayers,
      };

      event.clipboardData?.setData(
        'text/html',
        ClipboardUtils.toEncodedHTML(data),
      );

      if (event.type === 'cut') {
        dispatch(
          'deleteLayer',
          selectedLayers.map((layer) => layer.do_objectID),
        );
      }
    };

    document.addEventListener('copy', handler);
    document.addEventListener('cut', handler);

    return () => {
      document.removeEventListener('copy', handler);
      document.removeEventListener('cut', handler);
    };
  }, [dispatch, selectedLayers]);
}
