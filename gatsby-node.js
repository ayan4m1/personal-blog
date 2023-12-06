const { resolve } = require('path');

const createArticlePages = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/article.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
            headings(depth: h1) {
              value
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL markdown query.');
    return;
  }

  let counter = 0;

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const {
      frontmatter: { path },
      headings
    } = node;

    if (!path) {
      reporter.warn(
        `Did not find a path in the frontmatter of ${
          headings.length ? headings[0].value : 'unknown page'
        }`
      );
      return;
    }

    counter++;
    createPage({
      component,
      path
    });
  });

  reporter.info(`Created ${counter} markdown pages!`);
};
const createArticleListings = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/articleListing.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      allDirectory(
        filter: {
          sourceInstanceName: { eq: "articles" }
          relativePath: { ne: "" }
        }
      ) {
        edges {
          node {
            relativePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL markdown query.');
    return;
  }

  let counter = 0;

  result.data.allDirectory.edges.forEach(({ node }) => {
    const { relativePath } = node;

    console.dir(relativePath);

    counter++;
    createPage({
      context: {
        pathPrefix: `/${relativePath}/*`,
        articleName: relativePath
      },
      component,
      path: `/${relativePath}`
    });
  });

  reporter.info(`Created ${counter} article index pages!`);
};

exports.createPages = async (options) => {
  await createArticleListings(options);
  await createArticlePages(options);
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [resolve(__dirname, 'src'), 'node_modules']
    }
  });
};
