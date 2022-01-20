
import { Db } from "mongodb";
import ProductsService from "./../../services/products.service";
const queryProductResolvers = {
  Query: {
    hello: () => "Hola",
    async products(
      _: {},
      args: {
        page: number;
        itemsPage: number;
        active: string;
      },
      context: { db: Db }
    ) {
      return await new ProductsService({pagination: {
        page: args.page,
        itemsPage: args.itemsPage
      }}, context).items(args.active);
    },
    async product(
      _: {},
      args: { id: string },
      context: { db: Db }
    ): Promise<{
      status: boolean;
      message: string;
      item: any;
    }> {
      return await new ProductsService(args, context).details();
    },
  },
};

export default queryProductResolvers;