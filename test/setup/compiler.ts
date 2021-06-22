import path from 'path'
import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

export default function compiler(
  fixture: string,
  options = {} as alterCssUrlLoader.Options
): Promise<webpack.Stats> {
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

  compiler.outputFileSystem = createFsFromVolume(new Volume())
  compiler.outputFileSystem.join = path.join.bind(path)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(stats.toJson().errors[0].message)

      resolve(stats)
    })
  })
}
