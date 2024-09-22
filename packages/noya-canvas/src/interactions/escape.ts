import { ReactEventHandlers } from '@repo/noya-designsystem';
import { handleActionType, InteractionState, SelectionType } from '@repo/noya-state';
import { InteractionAPI } from './types';

export interface EscapeActions {
  selectLayer: (id: string[], selectionType?: SelectionType) => void;
  reset: () => void;
}

export function escapeInteraction(actions: EscapeActions) {
  return handleActionType<
    InteractionState,
    [InteractionAPI],
    ReactEventHandlers
  >({
    none: (interactionState, api) => ({
      onKeyDown: api.handleKeyboardEvent({
        Escape: () => {
          actions.selectLayer([]);
          actions.reset();
        },
      }),
    }),
  });
}
