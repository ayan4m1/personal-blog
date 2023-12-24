import PropTypes from 'prop-types';
import { Fragment } from 'react';
import Snowfall from 'react-snowfall';

import Header from 'components/header';
import useDarkMode from 'hooks/useDarkMode';
import { getDate, getMonth } from 'date-fns';

export default function Layout({ children }) {
  useDarkMode();

  const isChristmas =
    getMonth(Date.now()) === 11 && [24, 25, 26].includes(getDate(Date.now()));

  return (
    <Fragment>
      {isChristmas && <Snowfall />}
      <Header />
      <main className="mt-3 mb-2">{children}</main>
    </Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
