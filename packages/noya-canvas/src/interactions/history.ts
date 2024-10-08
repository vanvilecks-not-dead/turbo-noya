import { ReactEventHandlers } from '@repo/noya-designsystem';
import { handleActionType, InteractionState } from '@repo/noya-state';
import { InteractionAPI } from './types';

export interface HistoryActions {
  undo: () => void;
  redo: () => void;
}

type MenuItemType = 'undo' | 'redo';

export function historyInteraction({ undo, redo }: HistoryActions) {
  const shortcuts = {
    'Mod-z': () => undo(),
    'Mod-Shift-z': () => redo(),
  };

  return handleActionType<
    InteractionState,
    [InteractionAPI],
    ReactEventHandlers<MenuItemType>
  >({
    none: (interactionState, api) => ({
      onContributeMenuItems: () => {
        return [
          {
            value: 'undo',
            title: 'Undo',
            disabled: !api.canUndo,
            shortcut: 'Mod-z',
            role: 'undo',
          },
          {
            value: 'redo',
            title: 'Redo',
            disabled: !api.canRedo,
            shortcut: 'Mod-Shift-z',
            role: 'redo',
          },
        ];
      },
      onSelectMenuItem: (id) => {
        switch (id) {
          case 'undo':
            undo();
            break;
          case 'paste':
            redo();
            break;
        }
      },
      onKeyDown: api.handleKeyboardEvent(shortcuts),
    }),
    insert: (interactionState, api) => ({
      onKeyDown: api.handleKeyboardEvent(shortcuts),
    }),
  });
}
