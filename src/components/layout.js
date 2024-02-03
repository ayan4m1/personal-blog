import PropTypes from 'prop-types';
import { Snowfall } from 'react-snowfall';
import { getDate, getMonth } from 'date-fns';

import Header from 'components/header';
import usePrefersReducedMotion from 'hooks/usePrefersReducedMotion';
import ThemeProvider from './themeProvider';

export default function Layout({ children }) {
  const disableMotion = usePrefersReducedMotion();
  const isChristmas =
    getMonth(Date.now()) === 11 && [24, 25, 26].includes(getDate(Date.now()));

  return (
    <ThemeProvider>
      {!disableMotion && isChristmas && <Snowfall />}
      <Header />
      <main className="mt-3 mb-2">{children}</main>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
