import Koa from 'koa';
import serve from 'koa-static';
import * as webpack from 'webpack';
import koaWebpack from "koa-webpack";
import config from '../../webpack.config.js';
import * as devMiddleware from 'koa-webpack-dev-middleware';
import * as hotMiddleware from 'koa-webpack-hot-middleware';

const app = new Koa();

const middleware = (async () => {
    return await koaWebpack({config});
})();

middleware.then(middleware => app.use(middleware)).then(() => app.listen(8080));