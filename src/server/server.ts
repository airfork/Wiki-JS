import { config as dotenv } from 'dotenv';
import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static-server';
import koaWebpack from 'koa-webpack';
import Router from 'koa-router';
import { verify } from 'jsonwebtoken';
import { connect } from 'mongoose';
import config from '../../webpack.config.js';
import webpack from 'webpack';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';
import { Sequelize } from 'sequelize-typescript';

import { schemaWithResolvers } from './graphql/schema';
import { UserModel, User as DbUser, SequelizeUser } from './db/users';
import { SequelizePage } from './db/pages';
import { SequelizeTag } from './db/tags';
import { UserPage } from './db/user_page';
import { SequelizeImage } from './db/images';

const mongoUrl = 'mongodb://127.0.0.1:27017/wiki'
const app = new Koa();
const router = new Router();
const compiler = webpack(config);

type jwtClaims = {
  username: string,
};

export type ApolloContext = {
  user?: DbUser,
  sequelize: Sequelize,
};

const generalSetup = async () => {
  // Load .env variables
  dotenv();
  // Connect to DB
  console.info(`Trying to connect to database at ${mongoUrl}...`);

  await connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    authSource: 'admin',
  }).catch(reason => {
    console.error(reason);
    process.exit(1);
  });

  console.info("Connected to database!");

  app.use(koaBody());

  const sequelize = new Sequelize(process.env.POSTGRES_DB!, process.env.POSTGRES_USER!, process.env.POSTGRES_PASSWORD!, {
    host: 'localhost',
    dialect: 'postgres',
    repositoryMode: true,
    models: [SequelizeUser, SequelizeUser, SequelizePage, SequelizeTag, SequelizeImage, UserPage],
  });

  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Setup Apollo middleware
  const server = new ApolloServer({
    schema: schemaWithResolvers,
    context: async (req): Promise<ApolloContext | null> => {
      const token: string | null = req.ctx.request.header.authorization;

      if (token == null) {
        return { sequelize };
      }

      const claims = verify(token, process.env.JWT_SECRET!) as jwtClaims;
      const userRepository = sequelize.getRepository(SequelizeUser);
      return {
        user: await userRepository.findByPk(claims.username) ?? undefined,
        sequelize,
      };
    }
  });
  server.applyMiddleware({ app });

};

const prodSetup = () => {
  app.use(router.routes());
  app.use(serve({ rootDir: 'dist', notFoundFile: 'index.html' }));
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
  router.get('/:fallback', async ctx => {
    await send(ctx, 'dist/index.html');
  })
  app.use(webpackMiddle);
  app.use(router.routes());
}

generalSetup()
  .then(() => process.env.NODE_ENV === 'production' ? prodSetup() : devSetup())
  .then(() => app.listen(8080, () => {
    console.log('🚀 Server ready at http://localhost:8080')
  }));