const withMdxEnhanced = require('next-mdx-enhanced');
const withYaml = require('next-plugin-yaml');

const plugins = [
  withMdxEnhanced({
    layoutPath: 'layouts',
    defaultLayout: true,
    fileExtensions: ['mdx'],
    remarkPlugins: [],
    rehypePlugins: [],
    extendFrontMatter: {
      process: (mdxContent, frontMatter) => {},
      phase: 'prebuild|loader|both',
    },
  }),
  withYaml
];

function apply(config, plugin) { return plugin(config); }

const nextConfig = {};

module.exports = plugins.reduce(apply, nextConfig);