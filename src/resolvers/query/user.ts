import UsersService from "./../../services/users.service";
import { Db } from "mongodb";

const queryUserResolvers = {
  Query: {
    users(
      _: {},
      args: {
        page: number;
        itemsPage: number;
        active: string;
      },
      context: { db: Db }
    ) {
      return new UsersService(args, context).items(args.active);
    },
    user(
      _: {},
      args: {
        id: string
      },
      context: { db: Db }
    ) {
      return new UsersService(args, context).details();
    },
    login(
      _: {},
      args: {
        email: string;
        password: string;
      },
      context: { db: Db }
    ) {
      return new UsersService({ user: args }, context).login();
    },
    me(_: {}, __: {}, context: { token: string }) {
      return new UsersService(__, context).auth();
    },
  },
};

export default queryUserResolvers;
