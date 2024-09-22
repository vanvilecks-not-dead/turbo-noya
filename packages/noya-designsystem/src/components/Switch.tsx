import * as SwitchPrimitive from '@radix-ui/react-switch';
import styled from 'styled-components';

type SwitchVariant = 'normal' | 'primary' | 'secondary';

const SwitchRoot = styled(SwitchPrimitive.Root)<{
  variant: SwitchVariant;
}>(({ theme, variant }) => ({
  all: 'unset',
  width: 32,
  height: 19,
  backgroundColor: theme.colors.activeBackground,
  borderRadius: '9999px',
  position: 'relative',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
  // '&:focus': {
  //   boxShadow: `0 0 0 1px ${
  //     variant === 'secondary' ? theme.colors.secondary : theme.colors.primary
  //   }`,
  // },
  '&[data-state="checked"]': {
    backgroundColor:
      variant === 'primary'
        ? theme.colors.primary
        : variant === 'secondary'
        ? theme.colors.secondary
        : undefined,
  },
}));

const SwitchThumb = styled(SwitchPrimitive.Thumb)({
  display: 'block',
  width: 15,
  height: 15,
  backgroundColor: 'white',
  borderRadius: '9999px',
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(15px)' },
});

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  variant?: SwitchVariant;
}

export const Switch = function Switch({
  value,
  onChange,
  variant = 'normal',
}: Props) {
  return (
    <SwitchRoot
      variant={variant}
      checked={value}
      onCheckedChange={(newValue) => {
        onChange(newValue);
      }}
    >
      <SwitchThumb />
    </SwitchRoot>
  );
};
