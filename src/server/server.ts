import Koa from 'koa';
import koaWebpack from "koa-webpack";
import config from '../../webpack.config.js';
import webpack from 'webpack';
import routes from '../client/routes';

const app = new Koa();
const compiler = webpack(config)
const setUp = async () => {
  const webpackMiddle = await koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
      },
      writeToDisk: true,
    }
  });
  app.use(webpackMiddle);
}

setUp()
  .then(() => app.listen(8080));