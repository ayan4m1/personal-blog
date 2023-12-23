require('dotenv/config');

const manifestOptions = {
  name: "Andrew's Space",
  /* eslint-disable camelcase */
  short_name: 'andrewdelisa',
  start_url: '/',
  background_color: '#4582ec',
  theme_color: '#4582ec',
  /* eslint-enable camelcase */
  display: 'minimal-ui',
  icon: 'src/images/gatsby-icon.png'
};

const gtagOptions = {
  trackingId: process.env.GA_TRACKING_ID,
  head: true,
  anonymize: true
};

const remarkPlugins = [
  {
    resolve: 'gatsby-remark-external-links',
    options: {
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  },
  {
    resolve: `gatsby-remark-images`,
    options: {
      maxWidth: 800
    }
  },
  {
    resolve: 'gatsby-remark-classes',
    options: {
      classMap: {
        table: 'table table-striped'
      }
    }
  },
  'gatsby-remark-autolink-headers',
  'gatsby-remark-numbered-footnotes',
  'gatsby-remark-prismjs'
];

module.exports = {
  trailingSlash: 'never',
  siteMetadata: {
    title: "Andrew's Space",
    author: 'ayan4m1',
    description: 'Writing about technology.',
    siteUrl: 'https://andrewdelisa.com/'
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'sourceImages',
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'articles',
        path: `${__dirname}/articles`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'snippets',
        path: `${__dirname}/snippets`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/data`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/images`
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: manifestOptions
    },
    {
      resolve: 'gatsby-plugin-gtag',
      options: gtagOptions
    },
    'gatsby-plugin-eslint',
    'gatsby-plugin-image',
    'gatsby-plugin-mdx',
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-source-code',
      options: {
        mimeTypes: ['application/javascript', 'text/jsx', 'text/x-scss']
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: remarkPlugins
      }
    }
  ]
};
