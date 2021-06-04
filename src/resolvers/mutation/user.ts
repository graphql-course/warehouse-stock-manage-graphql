import { Db } from "mongodb";
import { IUser } from "../../interfaces/user.interface";

const resolversUserMutation = {
    Mutation: {
      register(_: {}, args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        // return new UsersService(_: {},  { user }, context).register();
      },
      updateUser(_: {}, args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        // return new UsersService(_: {},  { user }, context).modify();
      },
      deleteUser(_: {}, args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        // return new UsersService(_: {},  { id }, context).delete();
      },
      blockUser(_: {},args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        // return new UsersService(_: {},  { id }, context).unblock(unblock, admin);
      },
    },
  };

  export default resolversUserMutation;