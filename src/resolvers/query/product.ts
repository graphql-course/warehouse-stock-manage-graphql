import { IResolvers } from 'graphql-tools';
import { Db } from 'mongodb';
import { COLLECTIONS } from '../../config/constants';

const queryProductResolvers: IResolvers = {
    Query: {
        hello: () => "Hola",
        async products(_, __, { db }) {
            const database = db as Db;
            return await database.collection(COLLECTIONS.PRODUCTS).find().toArray().then(
                (result: Array<object>) =>  {
                    return {
                        status: true,
                        message: 'Lista de productos cargada correctamente',
                        list: result
                    }
                }
            ).catch(() => {
                return {
                    status: false,
                    message: 'Lista de productos no cargada. Comprueba la conexión y si el servidor está en marcha correctamente',
                    list: []
                }
            });
        }
    }
};

export default queryProductResolvers;