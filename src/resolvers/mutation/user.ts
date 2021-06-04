import { Db } from "mongodb";
import { IUser } from "../../interfaces/user.interface";
import UsersService from "../../services/users.service";

const resolversUserMutation = {
    Mutation: {
      register(_: {}, args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
            console.log(context);
        return new UsersService(args, context).register()
      },
      updateUser(_: {}, args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        return new UsersService(args, context).modify();
      },
      blockUser(_: {},args: { user: IUser }, 
        context: { db: Db, token: string, uuid: string}) {
        // return new UsersService(_: {},  { id }, context).unblock(unblock, admin);
      },
    },
  };

  export default resolversUserMutation;