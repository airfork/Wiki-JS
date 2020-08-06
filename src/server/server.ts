import Koa from 'koa';
import koaWebpack from "koa-webpack";
import config from '../../webpack.config.js';

const app = new Koa();

const middleware = (async () => {
    return await koaWebpack({config});
})();

middleware.then(middleware => app.use(middleware)).then(() => app.listen(8080));