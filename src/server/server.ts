import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static-server';
import koaWebpack from 'koa-webpack';
import Router from 'koa-router';
import config from '../../webpack.config.js';
import webpack from 'webpack';

import routes from '../client/routes';
import { connect } from 'mongoose';

const mongoUrl = 'mongodb://127.0.0.1:27017/wiki'
const app = new Koa();
const router = new Router();
const compiler = webpack(config);

const generalSetup = async () => {
  // Connect to DB
  console.info(`Trying to connect to database at ${mongoUrl}...`);
  await connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(reason => {
    console.error(reason);
    process.exit(1);
  });
  console.info("Connected to database!");
  // Add routes for SPA
  routes.map(route => route.path).forEach(path => {
    router.get(path, async ctx => {
      await send(ctx, 'dist/index.html');
    });
  })
};

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
        return /\.(css|html|html.gz|css.gz)$/.test(filePath)
      },
    }
  });
  app.use(webpackMiddle);
  app.use(router.routes());
}

generalSetup()
  .then(() => process.env.NODE_ENV === 'production' ? prodSetup() : devSetup())
  .then(() => app.listen(8080));