module.exports = {
  plugins: [
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
      resolve: 'gatsby-transformer-source-code',
      options: {
        mimeTypes: ['application/javascript']
      }
    }
  ]
};
