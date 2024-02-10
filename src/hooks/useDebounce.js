import { useRef } from 'react';
import { debounce } from 'lodash-es';

export default function useDebounce(handler) {
  return useRef(debounce(handler, 250)).current;
}
