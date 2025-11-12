import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

export default {
  entry: './src/index.ts',
  target: 'node',
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  devtool: isDev ? 'inline-source-map' : 'source-map',
};
