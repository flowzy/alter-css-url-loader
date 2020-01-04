import path from 'path'
import webpack from 'webpack'
import MemoryFileSystem from 'memory-fs'

export default (
  fixture: string,
  options = {} as alterCssUrlLoader.Options
): Promise<Error | webpack.Stats> => {
  const compiler = webpack({
    context: __dirname,
    entry: `../css/${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.css',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },

            {
              loader: path.resolve(__dirname, '../../src/loader.ts'),
              options,
            },
          ],
        },
      ],
    },
  })

  compiler.outputFileSystem = new MemoryFileSystem()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(new Error(...stats.toJson().errors))

      resolve(stats)
    })
  })
}
