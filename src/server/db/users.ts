import { Table, Column, Model, PrimaryKey, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { Page } from './pages';
import { UserPage } from './user_page';
import { QueryResolvers, MutationResolvers, NewUser } from '../graphql/types';
import { ApolloContext } from '../server';
import { AuthenticationError, UserInputError } from 'apollo-server-koa';
import { hash } from 'argon2';
import { sign } from 'jsonwebtoken';

@Table
class User extends Model implements User {
  @PrimaryKey
  @Column
  username!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Column
  admin!: boolean;

  @BelongsToMany(() => Page, () => UserPage)
  pages!: Page[];
}

const UserQueries: QueryResolvers = {
  getCurrentUser: async (_, __, { user }: ApolloContext) => user as User,
  getUsers: async (_, __, { userRepo }: ApolloContext) => await userRepo.findAll(),
}

const UserMutations: MutationResolvers = {
  makeAdmin: async (_, { username }, { user, userRepo }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("No authorization token provided")
    }
    if (!user.admin) {
      throw new AuthenticationError("Must be an admin to make another user an admin");
    }
    const toUpdate = await userRepo.findByPk(username);
    if (toUpdate == null) {
      throw new UserInputError("Provided user does not exist");
    }
    toUpdate.admin = true;
    await toUpdate.save();
    return toUpdate as User;
  },

  createUser: async (_, { user }, { userRepo }: ApolloContext) => {
    if (await userRepo.findByPk(user.username) != null) {
      throw new UserInputError("Username already exists");
    }
    let numUsers = await userRepo.count();
    let newUser = await userRepo.create({
      ...user,
      admin: numUsers === 0,
      password: await hash(user.password),
    });
    return {
      username: newUser.username,
      admin: newUser.admin,
      token: sign({ username: newUser.username }, process.env.JWT_SECRET!),
    } as NewUser;
  },

  deleteUser: async (_, { username }, { user, userRepo }: ApolloContext) => {
    if (user == null) {
      throw new AuthenticationError("Must be signed in to delete a user");
    }
    if (!user.admin) {
      throw new AuthenticationError("Must be an admin to delete a user");
    }
    const dbUser = await userRepo.findByPk(username);
    if (dbUser == null) {
      throw new UserInputError("Could not find specified username to delete");
    }
    await dbUser.destroy();
    return dbUser as User;
  },
}

export { User, UserQueries, UserMutations };