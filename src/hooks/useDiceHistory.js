import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export default function useDiceHistory() {
  const [diceRolls, setDiceRolls] = useLocalStorageState('diceRolls', {
    defaultValue: []
  });
  const appendRoll = useCallback(
    (roll) => setDiceRolls((prevVal) => [...prevVal, roll]),
    [setDiceRolls]
  );
  const clearRolls = useCallback(() => setDiceRolls([]), [setDiceRolls]);

  return {
    diceRolls,
    appendRoll,
    clearRolls
  };
}
