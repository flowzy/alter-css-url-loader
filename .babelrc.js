const MIN_BABEL_VERSION = 7

module.exports = (api) => {
  api.assertVersion(MIN_BABEL_VERSION)
  api.cache(true)

  return {
    presets: [
      '@babel/preset-typescript',
      'minify',
      [
        '@babel/preset-env',
        {
          targets: {
            node: '8.12.0',
          },
        },
      ],
    ],
  }
}
