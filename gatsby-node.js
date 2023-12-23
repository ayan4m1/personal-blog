const { resolve } = require('path');

const createArticlePages = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/article.js');
  const mdxComponent = resolve('src/components/mdxArticle.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          fileAbsolutePath
          frontmatter {
            path
          }
        }
      }
      allMdx {
        nodes {
          internal {
            contentFilePath
          }
          frontmatter {
            path
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

  result.data.allMarkdownRemark.nodes.forEach((node) => {
    const {
      fileAbsolutePath,
      frontmatter: { path }
    } = node;

    if (!path) {
      reporter.warn(
        `Did not find a path in the frontmatter of ${fileAbsolutePath}`
      );
      return;
    }

    counter++;
    createPage({
      component,
      path
    });
  });
  result.data.allMdx.nodes.forEach((node) => {
    const {
      frontmatter: { path },
      internal: { contentFilePath }
    } = node;

    if (!path) {
      reporter.warn(
        `Did not find a path in the frontmatter of ${contentFilePath}`
      );
      return;
    }

    counter++;
    createPage({
      component: `${mdxComponent}?__contentFilePath=${contentFilePath}`,
      path,
      context: {
        pathGlob: `${path.substring(1)}/**/*`
      }
    });
  });

  reporter.info(`Created ${counter} markdown pages!`);
};
const createArticleListings = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/articleCategory.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      allArticleCategoriesJson {
        nodes {
          name
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL markdown query.');
    return;
  }

  let counter = 0;

  result.data.allArticleCategoriesJson.nodes.forEach((node) => {
    const { name } = node;

    counter++;
    createPage({
      context: {
        pathPrefix: `/${name}/*`,
        categoryName: name
      },
      component,
      path: `/${name}`
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
