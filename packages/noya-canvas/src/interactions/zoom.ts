import { ReactEventHandlers } from '@repo/noya-designsystem';
import { handleActionType, InteractionState } from '@repo/noya-state';
import { InteractionAPI } from './types';

export interface ZoomActions {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomActualSize: () => void;
}

type MenuItemType = 'zoomIn' | 'zoomOut' | 'zoomActualSize';

export function zoomInteraction({
  zoomIn,
  zoomOut,
  zoomActualSize,
}: ZoomActions) {
  const handlers = handleActionType<
    InteractionState,
    [InteractionAPI],
    ReactEventHandlers<MenuItemType>
  >({
    none: (interactionState, api) => ({
      onContributeMenuItems: () => {
        return [
          {
            title: 'Zoom In',
            value: 'zoomIn',
            shortcut: 'Mod-+',
          },
          {
            title: 'Zoom Out',
            value: 'zoomOut',
            shortcut: 'Mod--',
          },
          {
            title: 'Actual Size',
            value: 'zoomActualSize',
            shortcut: 'Mod-0',
          },
        ];
      },
      onSelectMenuItem: (id) => {
        switch (id) {
          case 'zoomIn':
            api.logEvent('Project - View - Zoomed Wireframe (In)', {
              'Old Zoom Level': api.zoomValue,
            });
            zoomIn();
            break;
          case 'zoomOut':
            api.logEvent('Project - View - Zoomed Wireframe (Out)', {
              'Old Zoom Level': api.zoomValue,
            });
            zoomOut();
            break;
          case 'zoomActualSize':
            api.logEvent('Project - View - Zoomed Wireframe (Actual Size)', {
              'Old Zoom Level': api.zoomValue,
            });
            zoomActualSize();
            break;
        }
      },
    }),
  });

  const result: typeof handlers = (interactionState, key, api) => {
    return {
      ...handlers(interactionState, key, api),
      onKeyDown: api.handleKeyboardEvent({
        'Mod-=': () => {
          api.logEvent('Project - View - Zoomed Wireframe (In)', {
            'Old Zoom Level': api.zoomValue,
          });
          zoomIn();
        },
        'Mod--': () => {
          api.logEvent('Project - View - Zoomed Wireframe (Out)', {
            'Old Zoom Level': api.zoomValue,
          });
          zoomOut();
        },
        'Mod-0': () => {
          api.logEvent('Project - View - Zoomed Wireframe (Actual Size)', {
            'Old Zoom Level': api.zoomValue,
          });
          zoomActualSize();
        },
      }),
    };
  };

  return result;
}
