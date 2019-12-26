<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# alter-css-url-loader

Allows for a more custom altering of CSS's `url()` paths.

## Getting started

To begin, you'll need to install `alter-css-url-loader`:

```bash
$ npm install alter-css-url-loader webpack --save-dev
```

or

```bash
$ yarn add alter-css-url-loader webpack --dev
```

Chain the `alter-css-url-loader` directly after [sass-loader](https://github.com/webpack-contrib/sass-loader), if you're using Sass.

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
          }
          // compiles Sass to CSS
          'sass-loader',
        ]
      }
    ]
  }
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

> Note: this option cannot be used together with `alter`.

## License

[MIT](./LICENSE)
