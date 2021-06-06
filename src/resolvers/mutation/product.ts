import { IProduct } from './../../interfaces/product.interface';
import { PubSub } from "apollo-server-express";
import { IResolvers } from "graphql-tools";
import { COLLECTIONS, UPDATE_STOCK } from "../../config/constants";
import { Db } from "mongodb";
import ProductsService from "../../services/products.service";
import JWT from '../../lib/jwt';

const resolversProductMutation: IResolvers = {
  Mutation: {
    async addProduct(_, args: { product: IProduct }, context: { db: Db; pubsub: PubSub, token: string }) {
      return new ProductsService(args, context).insert();
    },
    async updateStock(_, { id, stock }, context: { db: Db; pubsub: PubSub, token: string }) {
      const database: Db = context.db;
      // Comprobar que la cantidad a restar no es mayor que la existente
      const itemDetails = await database
        .collection(COLLECTIONS.PRODUCTS)
        .findOne({ id });
      
      const tokenValid = new JWT().isAdmin(context.token);
      // comprobar que product no es null
      if (itemDetails === null || !tokenValid) {
        return {
          status: false,
          message: (!tokenValid && itemDetails !== null ) ?
                  "Necesitas un token válido y debes de ser ADMIN":
                  "Producto no definido, procura definirlo",
          item: null,
        };
      }

      // Si lo que queremos restar es mayor que la cantidad existente
      // ponemos el valor máximo para que se quede el stock vacio
      if (stock < 0 && stock + itemDetails.stock < 0) {
        stock = -itemDetails.stock;
      }
      return await database
        .collection(COLLECTIONS.PRODUCTS)
        .updateOne(
          { id },
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
            item: list.filter((product: {id: string}) => product.id === id)[0],
          };
        })
        .catch(() => false);
    },
  },
};

export default resolversProductMutation;
