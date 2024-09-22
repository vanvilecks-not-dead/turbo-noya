import { ReactEventHandlers } from '@repo/noya-designsystem';
import { handleActionType, InteractionState } from '@repo/noya-state';
import { InteractionAPI } from './types';

export interface DuplicateActions {
  duplicateLayer: (id: string[]) => void;
}

type MenuItemType = 'duplicate';

export function duplicateInteraction({ duplicateLayer }: DuplicateActions) {
  const handlers = handleActionType<
    InteractionState,
    [InteractionAPI],
    ReactEventHandlers<MenuItemType>
  >({
    none: (interactionState, api) => ({
      onContributeMenuItems: () => {
        return api.selectedLayerIds.length > 0
          ? [{ value: 'duplicate', title: 'Duplicate', shortcut: 'Mod-d' }]
          : [];
      },
      onSelectMenuItem: (id) => {
        switch (id) {
          case 'duplicate':
            api.logEvent('Project - Block - Duplicated', {
              'Block Count': api.selectedLayerIds.length,
            });

            duplicateLayer(api.selectedLayerIds);
            break;
        }
      },
    }),
  });

  const result: typeof handlers = (interactionState, key, api) => {
    return {
      ...handlers(interactionState, key, api),
      onKeyDown: api.handleKeyboardEvent({
        'Mod-d': () => duplicateLayer(api.selectedLayerIds),
      }),
    };
  };

  return result;
}
