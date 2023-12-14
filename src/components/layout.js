import PropTypes from 'prop-types';
import { Fragment } from 'react';

import Header from 'components/header';
import useDarkMode from 'hooks/useDarkMode';

export default function Layout({ children }) {
  useDarkMode();

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
