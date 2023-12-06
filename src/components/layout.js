import PropTypes from 'prop-types';
import { SSRProvider } from 'react-bootstrap';

import Header from 'components/header';

export default function Layout({ children }) {
  return (
    <SSRProvider>
      <Header />
      <main className="mt-3 mb-2">{children}</main>
    </SSRProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
