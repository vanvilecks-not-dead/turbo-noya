import { MenuItem, SEPARATOR_ITEM } from '@repo/noya-designsystem';

export type ThemeMenuItemType = 'duplicate' | 'group' | 'ungroup' | 'delete';

export const menuItems: MenuItem<ThemeMenuItemType>[] = [
  { value: 'duplicate', title: 'Duplicate' },
  { value: 'group', title: 'Group' },
  { value: 'ungroup', title: 'Ungroup' },
  SEPARATOR_ITEM,
  { value: 'delete', title: 'Delete' },
];
