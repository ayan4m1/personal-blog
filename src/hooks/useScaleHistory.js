import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { convert } from 'utils/units';

const calculate = (entry, denominator) => ({
  ...entry,
  result:
    convert(entry.value).from(entry.unit).to(entry.targetUnit) *
    (1 / denominator)
});

export default function useScaleHistory() {
  const [denominator, setDenominator] = useLocalStorageState('denominator', {
    defaultValue: 1
  });
  const [entries, setEntries] = useLocalStorageState('entries', {
    defaultValue: []
  });
  const clearEntries = useCallback(() => setEntries([]), [setEntries]);
  const pushEntry = useCallback(
    (entry) =>
      setEntries((original) => [...original, calculate(entry, denominator)]),
    [setEntries, denominator]
  );
  const updateDenominator = useCallback(
    (value) => {
      setEntries((original) =>
        original.map((entry) => calculate(entry, value))
      );
      setDenominator(value);
    },
    [setEntries, setDenominator]
  );

  return { entries, denominator, pushEntry, clearEntries, updateDenominator };
}
