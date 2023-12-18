import useMediaQuery from './useMediaQuery';

const mediaQuery = '(prefers-reduced-motion: no-preference)';

export default function usePrefersReducedMotion() {
  return !useMediaQuery(mediaQuery);
}
