import { IResolvers } from "graphql-tools";
import { Db } from "mongodb";
import ProductsService from "./../../services/products.service";
const queryProductResolvers: IResolvers = {
  Query: {
    hello: () => "Hola",
    products(
      _: {},
      args: {
        page: number;
        itemsPage: number;
        active: string;
      },
      context: { db: Db }
    ) {
      return new ProductsService(args, context).items(args.active);
    },
  },
};

export default queryProductResolvers;
