import { IProduct } from './../../interfaces/product.interface';
import { COLLECTIONS, UPDATE_STOCK } from "../../config/constants";
import { Db } from "mongodb";
import ProductsService from "../../services/products.service";
import { PubSub } from 'graphql-subscriptions';


const resolversProductMutation = {
  Mutation: {
    async addProduct(_: void, args: { product: IProduct }, context: { db: Db; pubsub: PubSub, token: string }) {
      return new ProductsService(args, context).insert();
    },
    async updateStock(_: void, args: { id: string, stock: number }, context: { db: Db; pubsub: PubSub, token: string }) {
      const database: Db = context.db;
      // Comprobar que la cantidad a restar no es mayor que la existente
      const itemDetails = await database
        .collection(COLLECTIONS.PRODUCTS)
        .findOne({ id: args.id });
      
      // comprobar que product no es null
      if (itemDetails === null) {
        return {
          status: false,
          message: "Producto no definido, procura definirlo",
          item: null,
        };
      }

      // Si lo que queremos restar es mayor que la cantidad existente
      // ponemos el valor máximo para que se quede el stock vacio
      if (args.stock < 0 && args.stock + itemDetails.stock < 0) {
        args.stock = -itemDetails.stock;
      }
      return await database
        .collection(COLLECTIONS.PRODUCTS)
        .updateOne(
          { id: args.id },
          {
            $inc: { stock: args.stock },
          }
        )
        .then(async () => {
          const list = await database
          .collection(COLLECTIONS.PRODUCTS)
          .find()
          .toArray() as unknown as Array<IProduct>;
          // Notificamos el cambio
          context.pubsub.publish(UPDATE_STOCK, {
            changeStock: list,
          });
          return {
            status: true,
            message: "Stock del producto correctamente actualizado",
            list,
            item: list.filter((product: {id: string}) => product.id === args.id)[0],
          };
        })
        .catch(() => false);
    },
    async updateProduct(_: void, args: {product: IProduct}, context: {db: Db, pubsub: PubSub, token: string }) {
      console.log(args, context)
      return new ProductsService(args, context).modify();
    }
  },
};

export default resolversProductMutation;