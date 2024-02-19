import PropTypes from 'prop-types';

import { SnippetContext } from 'hooks/useSnippetsContext';

export default function SnippetProvider({ snippets, children }) {
  return (
    <SnippetContext.Provider value={{ snippets }}>
      {children}
    </SnippetContext.Provider>
  );
}

SnippetProvider.propTypes = {
  snippets: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node.isRequired
};
