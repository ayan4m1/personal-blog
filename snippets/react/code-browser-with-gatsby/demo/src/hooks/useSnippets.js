import { createContext, useContext } from 'react';

export const SnippetContext = createContext({
  snippets: []
});

export default function useSnippets() {
  return useContext(SnippetContext);
}
