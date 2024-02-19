import { createContext, useContext } from 'react';

export const SnippetContext = createContext({
  snippets: []
});

export default function useSnippetsContext() {
  return useContext(SnippetContext);
}
