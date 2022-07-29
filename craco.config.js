const {addAfterLoader, loaderByName} = require('@craco/craco')

module.exports = async () => {
  // Remark GFM doesn't support CJS exports, so we need to use import syntax.
  // Fortunately, CRACO supports Async functions as the config export, 
  // thank you, dear frieds.
  const gfm = await import('remark-gfm').then((module) => module.default)

  return {
    webpack: {
      configure(webpackConfig) {
        addAfterLoader(webpackConfig, loaderByName('babel-loader'), {
          test: /\.mdx?$/,
          loader: require.resolve('@mdx-js/loader'),
          options: {
            remarkPlugins: [gfm],
          }
        })
        return webpackConfig
      }
    },
    babel: {
      presets: [],
      plugins: [],
    },
  }
}