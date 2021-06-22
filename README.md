<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>

<!-- prettier-ignore -->
  [![npm][npm]][npm-url]
  [![node][node]][node-url]
  [![travis][travis]][travis-url]
  [![coverage][coverage]][coverage-url]
  [![downloads][downloads]][npm-url]
  [![license][license]][license-url]

</div>

# alter-css-url-loader

Allows for a more custom altering of CSS's `url()` paths.

## Getting started

To begin, you'll need to install `alter-css-url-loader`:

```bash
$ npm install alter-css-url-loader webpack --save-dev
```

Loader must be chained directly after [sass-loader](https://github.com/webpack-contrib/sass-loader) or similar.

## Example

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Extracts CSS into a separate file
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              url: false, // disable url resolving
            },
          },
          // alters CSS url contents
          {
            loader: 'alter-css-url-loader',
            options: {
              alter(url) {
                // would return "../img/foo.png"
                // instead of "./img/foo.png"
                return url.replace('./', '../')
              },
            },
          },
          // compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
}
```

## Options

### `alter`

Type: `Function`

Alters each and every url given to it. This function should return a `String`.

### `reddit`

Type: `Boolean`

Determines whether a built-in function for transforming urls for Reddit should be used.

Example: `./img/headers/header-1.jpg` => `%%header-1%%`

> Note: this option, if set to "true", cannot be used together with `alter`.

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/alter-css-url-loader
[npm-url]: https://npmjs.com/package/alter-css-url-loader
[node]: https://img.shields.io/node/v/alter-css-url-loader
[node-url]: https://nodejs.org
[travis]: https://img.shields.io/travis/flowzy/alter-css-url-loader
[travis-url]: https://travis-ci.org/flowzy/alter-css-url-loader
[coverage]: https://coveralls.io/repos/github/flowzy/alter-css-url-loader/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/flowzy/alter-css-url-loader?branch=master
[downloads]: https://img.shields.io/npm/dt/alter-css-url-loader
[license]: https://img.shields.io/npm/l/alter-css-url-loader
[license-url]: ./LICENSE
