const { resolve } = require('path');

const createTriviaPages = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/trivia/game.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      shows: allShowsJson {
        nodes {
          showNumber
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL trivia query.');
    return;
  }

  let counter = 0;

  for (const { showNumber } of result.data.shows.nodes) {
    counter++;
    createPage({
      context: {
        showNumber
      },
      component,
      path: `/games/trivia/${showNumber}`
    });
  }

  reporter.info(`Created ${counter} trivia pages!`);
};

const createArticlePages = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/markdownArticle.js');
  const mdxComponent = resolve('src/components/mdxArticle.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      markdown: allMarkdownRemark {
        nodes {
          fileAbsolutePath
          frontmatter {
            path
          }
        }
      }
      mdx: allMdx {
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

  result.data.markdown.nodes.forEach((node) => {
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
  result.data.mdx.nodes.forEach((node) => {
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
        pathGlob: `${path.substring(1)}**/*`
      }
    });
  });

  reporter.info(`Created ${counter} markdown/MDX pages!`);
};
const createArticleListings = async ({ actions, graphql, reporter }) => {
  const component = resolve('src/components/articleCategory.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
      articleCategories: allArticleCategoriesJson {
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

  result.data.articleCategories.nodes.forEach((node) => {
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
  await createTriviaPages(options);
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [resolve(__dirname, 'src'), 'node_modules']
    }
  });
};
