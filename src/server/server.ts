import { config as dotenv } from 'dotenv';
import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static-server';
import koaWebpack from 'koa-webpack';
import Router from 'koa-router';
import { verify } from 'jsonwebtoken';
import config from '../../webpack.config.js';
import webpack from 'webpack';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';
import { Sequelize, Repository } from 'sequelize-typescript';

import { schemaWithResolvers } from './graphql/schema';
import { User } from './db/users';
import { SequelizePage } from './db/pages';
import { SequelizeTag } from './db/tags';
import { UserPage } from './db/user_page';
import { SequelizeImage } from './db/images';
import { TagPage } from './db/tag_page';

const mongoUrl = 'mongodb://127.0.0.1:27017/wiki'
const app = new Koa();
const router = new Router();
const compiler = webpack(config);

type jwtClaims = {
  username: string,
};

export type ApolloContext = {
  user?: User,
  sequelize: Sequelize,
  pageRepo: Repository<SequelizePage>,
  imageRepo: Repository<SequelizeImage>,
  userRepo: Repository<User>,
  tagRepo: Repository<SequelizeTag>,
  userPageRepo: Repository<UserPage>,
  tagPageRepo: Repository<TagPage>,
};

const generalSetup = async () => {
  // Load .env variables
  dotenv();
  // Connect to DB
  console.info(`Trying to connect to database at ${mongoUrl}...`);

  console.info("Connected to database!");

  app.use(koaBody());

  const sequelize = new Sequelize(process.env.POSTGRES_DB!, process.env.POSTGRES_USER!, process.env.POSTGRES_PASSWORD!, {
    host: 'localhost',
    dialect: 'postgres',
    repositoryMode: true,
    models: [User, User, SequelizePage, SequelizeTag, SequelizeImage, UserPage, TagPage],
  });

  await sequelize.authenticate();
  await sequelize.sync();

  // Setup Apollo middleware
  const server = new ApolloServer({
    schema: schemaWithResolvers,
    context: async (req): Promise<ApolloContext | null> => {
      const token: string | null = req.ctx.request.header.authorization;

      const userPageRepo = sequelize.getRepository(UserPage);
      const pageRepo = sequelize.getRepository(SequelizePage);
      const imageRepo = sequelize.getRepository(SequelizeImage);
      const userRepo = sequelize.getRepository(User);
      const tagRepo = sequelize.getRepository(SequelizeTag);
      const tagPageRepo = sequelize.getRepository(TagPage);

      const sequelizeData: ApolloContext = {
        sequelize,
        userPageRepo,
        pageRepo,
        imageRepo,
        userRepo,
        tagRepo,
        tagPageRepo,
      };

      if (token == null) {
        return sequelizeData;
      }

      const claims = verify(token, process.env.JWT_SECRET!) as jwtClaims;
      return {
        user: await userRepo.findByPk(claims.username) ?? undefined,
        ...sequelizeData,
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