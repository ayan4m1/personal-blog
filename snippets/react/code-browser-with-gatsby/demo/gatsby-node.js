const { resolve } = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const mdxComponent = resolve('src/components/mdxArticle.js');
  const { createPage } = actions;
  const result = await graphql(`
    {
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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [resolve(__dirname, 'src'), 'node_modules']
    }
  });
};
