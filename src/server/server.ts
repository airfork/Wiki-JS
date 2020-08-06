import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static-server';
import koaWebpack from 'koa-webpack';
import Router from 'koa-router';
import config from '../../webpack.config.js';
import webpack from 'webpack';

import routes from '../client/routes';

const app = new Koa();
const router = new Router();
const compiler = webpack(config);

const generalSetup = async () => {
  routes.map(route => route.path).forEach(path => {
    router.get(path, async ctx => {
      await send(ctx, 'dist/index.html');
    });
  })
}

const prodSetup = () => {
  app.use(router.routes());
  app.use(serve({ rootDir: 'dist' }));
};

const devSetup = async () => {
  const webpackMiddle = await koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
      },
      writeToDisk: (filePath) => {
        return /\.(css|html)$/.test(filePath)
      },
    }
  });
  app.use(webpackMiddle);
  app.use(router.routes());
}

generalSetup()
  .then(() => process.env.NODE_ENV === 'production' ? prodSetup() : devSetup())
  .then(() => app.listen(8080));