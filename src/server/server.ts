import { config as dotenv } from 'dotenv';
import validate from 'dotenv-validator';
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
import { Page } from './db/pages';
import { Tag } from './db/tags';
import { UserPage } from './db/user_page';
import { Image } from './db/images';
import { TagPage } from './db/tag_page';
import { ImagePage } from "./db/image_page";

const app = new Koa();
const router = new Router();
const compiler = webpack(config);

type jwtClaims = {
  username: string,
};

export type ApolloContext = {
  user?: User,
  sequelize: Sequelize,
  pageRepo: Repository<Page>,
  imageRepo: Repository<Image>,
  userRepo: Repository<User>,
  tagRepo: Repository<Tag>,
  userPageRepo: Repository<UserPage>,
  tagPageRepo: Repository<TagPage>,
  imagePageRepo: Repository<ImagePage>
};

const envDefault = {
  MYSQL_DATABASE: '',
  MYSQL_USER: '',
  MYSQL_ROOT_PASSWORD: '',
  JWT_SECRET: '',
};

const envRules = {
  MYSQL_DATABASE: {
    required: true,
  },
  MYSQL_USER: {
    required: true,
  },
  MYSQL_ROOT_PASSWORD: {
    required: true,
  },
  JWT_SECRET: {
    required: true,
  }
};

const generalSetup = async () => {
  // Load .env variables
  const envParsed = dotenv().parsed;
  process.env = { ...envDefault, ...process.env };

  try {
    validate({ envDefault, envParsed, envRules });
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
  // Connect to DB
  console.info("Connected to database!");

  app.use(koaBody());

  const sequelize = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_ROOT_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    repositoryMode: true,
    models: [User, Page, Tag, Image, UserPage, TagPage, ImagePage],
  });

  await sequelize.authenticate();
  await sequelize.sync();
  await sequelize.query('SET GLOBAL event_scheduler=ON;');
  // await sequelize.query(
  //   `CREATE OR REPLACE FUNCTION cleanupImages() RETURNS TRIGGER AS $cleanup$
  //        BEGIN
  //         DELETE FROM "Images" WHERE
  //         id NOT IN (SELECT DISTINCT image_id FROM "ImagePages")
  //         AND "createdAt" < NOW() - INTERVAL '1 Week';
  //
  //         RETURN NEW;
  //        END;
  //       $cleanup$ LANGUAGE plpgsql;
  //
  //       DROP TRIGGER IF EXISTS triggerCleanupImage ON "ImagePages";
  //
  //       CREATE TRIGGER triggerCleanupImage AFTER INSERT
  //       ON "ImagePages" FOR EACH STATEMENT
  //       EXECUTE PROCEDURE cleanupImages();
  //   `
  // )

  const userPageRepo = sequelize.getRepository(UserPage);
  const pageRepo = sequelize.getRepository(Page);
  const imageRepo = sequelize.getRepository(Image);
  const userRepo = sequelize.getRepository(User);
  const tagRepo = sequelize.getRepository(Tag);
  const tagPageRepo = sequelize.getRepository(TagPage);
  const imagePageRepo = sequelize.getRepository(ImagePage);

  // Setup Apollo middleware
  const server = new ApolloServer({
    schema: schemaWithResolvers,
    context: async (req): Promise<ApolloContext | null> => {
      const token: string | null = req.ctx.request.header.authorization;

      const sequelizeData: ApolloContext = {
        sequelize,
        userPageRepo,
        pageRepo,
        imageRepo,
        userRepo,
        tagRepo,
        tagPageRepo,
        imagePageRepo
      };

      if (token == null) {
        return sequelizeData;
      }

      console.log('verifying');
      let claims: jwtClaims;
      try {
        claims = verify(token, process.env.JWT_SECRET!) as jwtClaims;
      } catch (err) {
        claims = {
          username: '',
        }
      }
      return {
        user: await userRepo.findByPk(claims.username) ?? undefined,
        ...sequelizeData,
      };
    }
  });
  server.applyMiddleware({ app });

  router.get("/image/:id", async (ctx, next) => {
    const image = await imageRepo.findByPk(ctx.params.id);
    if (image != null) {
      ctx.type = image.mimetype;
      ctx.body = image.data;
      ctx.status = 200;
    } else {
      await next();
    }
  });
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
  app.use(webpackMiddle);
  app.use(router.routes());
  app.use(async ctx => {
    await send(ctx, 'dist/index.html');
  })
}

generalSetup()
  .then(() => process.env.NODE_ENV === 'production' ? prodSetup() : devSetup())
  .then(() => app.listen(8080, () => {
    console.log('🚀 Server ready at http://localhost:8080')
  }));