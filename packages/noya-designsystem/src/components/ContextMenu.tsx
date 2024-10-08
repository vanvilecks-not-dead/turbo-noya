import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { CheckIcon, ChevronRightIcon } from '@repo/noya-icons';
import { useKeyboardShortcuts } from '@repo/noya-keymap';
import  {
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import {
  CHECKBOX_RIGHT_INSET,
  CHECKBOX_WIDTH,
  getKeyboardShortcutsForMenuItems,
  KeyboardShortcut,
  MenuItem,
  SEPARATOR_ITEM,
  styles,
} from './internal/Menu';
import { Spacer } from './Spacer';

/* ----------------------------------------------------------------------------
 * Separator
 * ------------------------------------------------------------------------- */

const SeparatorElement = styled(RadixContextMenu.Separator)(
  styles.separatorStyle,
);

/* ----------------------------------------------------------------------------
 * Item
 * ------------------------------------------------------------------------- */

const ItemElement = styled(RadixContextMenu.Item)(styles.itemStyle);

const CheckboxItemElement = styled(RadixContextMenu.CheckboxItem)(
  styles.itemStyle,
);

const StyledItemIndicator = styled(RadixContextMenu.ItemIndicator)(
  styles.itemIndicatorStyle,
);

export interface MenuItemProps<T extends string> {
  value?: T;
  children: ReactNode;
  onSelect: (value: T) => void;
  checked: boolean;
  disabled: boolean;
  indented: boolean;
  shortcut?: string;
  icon?: ReactElement;
  items?: MenuItem<T>[];
}

const ContextMenuItem = memo(function ContextMenuItem<T extends string>({
  value,
  children,
  onSelect,
  checked,
  disabled,
  indented,
  icon,
  items,
  shortcut,
}: MenuItemProps<T>) {
  // The pointer event within the context menu will bubble outside of the
  // context menu unless we stop it here.
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => event.stopPropagation(),
    [],
  );

  const handleSelectItem = useCallback(() => {
    if (!value) return;

    onSelect(value);
  }, [onSelect, value]);

  if (checked) {
    return (
      <CheckboxItemElement
        checked={checked}
        disabled={disabled}
        onSelect={handleSelectItem}
      >
        <StyledItemIndicator>
          <CheckIcon />
        </StyledItemIndicator>
        {children}
      </CheckboxItemElement>
    );
  }

  const element = (
    <ItemElement
      disabled={disabled}
      onSelect={handleSelectItem}
      onPointerDown={handlePointerDown}
    >
      {indented && (
        <Spacer.Horizontal size={CHECKBOX_WIDTH - CHECKBOX_RIGHT_INSET} />
      )}
      {icon && (
        <>
          {icon}
          <Spacer.Horizontal size={8} />
        </>
      )}
      {children}
      {shortcut && (
        <>
          <Spacer.Horizontal />
          <Spacer.Horizontal size={24} />
          <KeyboardShortcut shortcut={shortcut} />
        </>
      )}
      {items && items.length > 0 && (
        <>
          <Spacer.Horizontal />
          <Spacer.Horizontal size={16} />
          <ChevronRightIcon />
        </>
      )}
    </ItemElement>
  );

  if (items && items.length > 0) {
    return (
      <ContextMenuRoot isNested items={items} onSelect={onSelect}>
        {element}
      </ContextMenuRoot>
    );
  } else {
    return element;
  }
});

/* ----------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

const Content = styled(RadixContextMenu.Content)(styles.contentStyle);
const SubContent = styled(RadixContextMenu.SubContent)(styles.contentStyle);

export interface MenuProps<T extends string> {
  children: ReactNode;
  items: MenuItem<T>[];
  onSelect: (value: T) => void;
  isNested?: boolean;
  shouldBindKeyboardShortcuts?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ContextMenuRoot<T extends string>({
  items,
  children,
  onSelect,
  isNested,
  shouldBindKeyboardShortcuts,
  onOpenChange,
}: MenuProps<T>) {
  const hasCheckedItem = items.some(
    (item) => item !== SEPARATOR_ITEM && item.checked,
  );

  const keymap = useMemo(
    () =>
      isNested || shouldBindKeyboardShortcuts === false
        ? {}
        : getKeyboardShortcutsForMenuItems(items, onSelect),
    [isNested, items, onSelect, shouldBindKeyboardShortcuts],
  );

  useKeyboardShortcuts(keymap);

  // We call preventDefault both to:
  // - Disable radix-ui's long-press-to-open behavior
  //   https://github.com/radix-ui/primitives/issues/748#issuecomment-869502837
  // - Mark the event as handled, so our ListView root doesn't handle it (a hack)
  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
  }, []);

  const RootComponent = isNested ? RadixContextMenu.Sub : RadixContextMenu.Root;
  const TriggerComponent = isNested
    ? RadixContextMenu.SubTrigger
    : RadixContextMenu.Trigger;
  const ContentComponent: typeof Content = isNested ? SubContent : Content;

  return (
    <RootComponent onOpenChange={onOpenChange}>
      <TriggerComponent asChild onPointerDown={onPointerDown}>
        {children}
      </TriggerComponent>
      <RadixContextMenu.Portal>
        <ContentComponent>
          {items.map((item, index) =>
            item === SEPARATOR_ITEM ? (
              <SeparatorElement key={index} />
            ) : (
              <ContextMenuItem
                key={item.value ?? index}
                value={item.value}
                indented={hasCheckedItem}
                checked={item.checked ?? false}
                disabled={item.disabled ?? false}
                icon={item.icon}
                onSelect={onSelect}
                items={item.items}
                shortcut={item.shortcut}
              >
                {item.title}
              </ContextMenuItem>
            ),
          )}
        </ContentComponent>
      </RadixContextMenu.Portal>
    </RootComponent>
  );
}

export const ContextMenu = memo(ContextMenuRoot);
