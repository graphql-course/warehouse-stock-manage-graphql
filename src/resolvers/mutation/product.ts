import { IProduct } from './../../interfaces/product.interface';
import { PubSub } from "apollo-server-express";
import { IResolvers } from "graphql-tools";
import { COLLECTIONS, UPDATE_STOCK } from "../../config/constants";
import { Db } from "mongodb";
import ProductsService from "../../services/products.service";

const resolversProductMutation: IResolvers = {
  Mutation: {
    async addProduct(_, args: { product: IProduct }, context: { db: Db; pubsub: PubSub }) {
      return new ProductsService(args, context).insert();
      /*return await database
        .collection(COLLECTIONS.PRODUCTS)
        .insertOne(product)
        .then(async () => {
          const listProducts = await database
            .collection(COLLECTIONS.PRODUCTS)
            .find()
            .toArray();
          
          return {
            status: true,
            message: "Producto correctamente añadido",
            list: listProducts,
            item: product,
          };
        })
        .catch((error: Error) => {
          return {
            status: false,
            message: error.message,
            list: [],
            item: null,
          };
        });*/
    },
    async updateStock(_, { code, stock }, context: { db: Db; pubsub: PubSub }) {
      const database: Db = context.db;
      // Comprobar que la cantidad a restar no es mayor que la existente
      const itemDetails = await database
        .collection(COLLECTIONS.PRODUCTS)
        .findOne({ code });

      // Si lo que queremos restar es mayor que la cantidad existente
      // ponemos el valor máximo para que se quede el stock vacio
      if (stock < 0 && stock + itemDetails.stock < 0) {
        stock = -itemDetails.stock;
      }
      return await database
        .collection(COLLECTIONS.PRODUCTS)
        .updateOne(
          { code },
          {
            $inc: { stock },
          }
        )
        .then(async () => {
          const list = await database
          .collection(COLLECTIONS.PRODUCTS)
          .find()
          .toArray();
          // Notificamos el cambio
          context.pubsub.publish(UPDATE_STOCK, {
            changeStock: list,
          });
          return {
            status: true,
            message: "Stock del producto correctamente actualizado",
            list,
            item: list.filter((product: {code: string}) => product.code === code)[0],
          };
        })
        .catch(() => false);
    },
  },
};

export default resolversProductMutation;
