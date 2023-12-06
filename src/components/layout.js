import PropTypes from 'prop-types';
import { SSRProvider } from 'react-bootstrap';

import Header from 'components/header';

const Layout = ({ children }) => {
  return (
    <SSRProvider>
      <Header />
      <main className="mt-3">{children}</main>
    </SSRProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
