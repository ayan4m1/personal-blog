import PropTypes from 'prop-types';

import Header from 'components/header';
import { Fragment } from 'react';

export default function Layout({ children }) {
  return (
    <Fragment>
      <Header />
      <main className="mt-3 mb-2">{children}</main>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
