import Koa from 'koa';
import koaWebpack from "koa-webpack";
import send from 'koa-send';
import config from '../../webpack.config.js';
import webpack from 'webpack';
import routes from '../client/routes';

const app = new Koa();
const compiler = webpack(config);

const generalSetup = async () => {
  //TODO
}

const prodSetup = () => {

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
  app.use(async (ctx, next) => {
    if (routes.map(route => route.path).includes(ctx.request.path)) {
      await send(ctx, 'dist/index.html')
    }
    else {
      await next();
    }
  });
}

generalSetup()
  .then(() => process.env.NODE_ENV === 'production' ? {} : devSetup())
  .then(() => app.listen(8080));