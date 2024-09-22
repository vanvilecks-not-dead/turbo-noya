import { useLazyValue } from '@repo/noya-react-utils';
import { useEffect, useState } from 'react';

const preferDarkQuery = '(prefers-color-scheme: dark)';

type ColorScheme = 'light' | 'dark';

export function useSystemColorScheme() {
  const mediaQuery = useLazyValue(() => window.matchMedia(preferDarkQuery));

  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    mediaQuery.matches ? 'dark' : 'light',
  );

  useEffect(() => {
    const listener = ({ matches }: MediaQueryListEvent) => {
      setColorScheme(matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [mediaQuery]);

  return colorScheme;
}
