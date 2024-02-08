import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Snowfall } from 'react-snowfall';
import { getDate, getMonth } from 'date-fns';
import { graphql, useStaticQuery } from 'gatsby';

import Header from 'components/header';
import usePrefersReducedMotion from 'hooks/usePrefersReducedMotion';
import ThemeProvider from './themeProvider';

export default function Layout({
  title,
  description = '',
  lang = 'en',
  meta = [],
  children
}) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
        }
      }
    }
  `);

  const metaDescription = description || site.siteMetadata.description;
  const disableMotion = usePrefersReducedMotion();
  const isChristmas =
    getMonth(Date.now()) === 11 && [24, 25, 26].includes(getDate(Date.now()));

  return (
    <ThemeProvider>
      <Helmet
        htmlAttributes={{
          lang
        }}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        meta={[
          {
            name: `description`,
            content: metaDescription
          },
          {
            property: `og:title`,
            content: title
          },
          {
            property: `og:description`,
            content: metaDescription
          },
          {
            property: `og:type`,
            content: `website`
          }
        ].concat(meta)}
      />
      {!disableMotion && isChristmas && <Snowfall />}
      <Header />
      <main className="mt-3 mb-2">{children}</main>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
