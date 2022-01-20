import { createServer, Server as HTTPServer } from "http";
import compression from "compression";
import express, { Application } from "express";
import { execute, GraphQLSchema, subscribe } from "graphql";
import depthLimit from "graphql-depth-limit";
import Database from "./config/database";
import { machineUUID } from "./config/constants";
import environments from "./config/environments";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";

class Server {
  private app!: Application;
  private httpServer!: HTTPServer;
  private schema!: GraphQLSchema;
  private database!: Database;
  private pubsub!: PubSub;
  private readonly DEFAULT_PORT_SERVER = process.env.PORT || 3002;
  constructor(schema: GraphQLSchema) {
    if (schema === undefined) {
      throw new Error("Need GraphQL Schema to work in API GraphQL");
    }
    this.schema = schema;
    this.initializeEnvironments();
    this.init();
  }

  /**
   * Inicializar todas las configuraciones establecidas en el servidor
   */
  private init() {
    this.configExpress();
    this.initializeDbPubSub();
    this.configApolloServer();
    // this.configRoutes();
  }

  private configExpress() {
    this.app = express();

    this.app.use(compression());

    this.httpServer = createServer(this.app);
  }

  private initializeEnvironments() {
    // Inicializar variables de entorno
    if (process.env.NODE_ENV !== "production") {
      const envs = environments;
      console.log(envs);
    }
  }

  private async initializeDbPubSub() {
    this.database = new Database();
    this.pubsub = new PubSub();
  }

  private async configApolloServer() {
    const db = await this.database.init();
    // Configurar el servidor apollo server
    const apolloServer = new ApolloServer({
      schema: this.schema,
      context: async ({ req, connection }: any) => {
        const token = req
          ? req.headers.authorization
          : connection.authorization;
        return {
          db,
          pubsub: this.pubsub,
          token,
          uuid: machineUUID(),
        };
      },
      introspection: true,
      validationRules: [depthLimit(4)],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });

    // NUEVA MANERA DE IMPLEMENTAR LA CREACIÓN DE LA IMPLEMENTACIÓN
    // PARA OBTENER INFORMACIÓN DE ACTUALIZACIONES
    SubscriptionServer.create(
      {
        schema: this.schema,
        execute,
        subscribe,
        // Importante añadir esto para pasar la información del contexto
        onConnect: () => ({ db, pubsub: this.pubsub, user: "Anartz" }),
      },
      { server: this.httpServer, path: apolloServer.graphqlPath }
    );
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT_SERVER, () => {
      callback(+this.DEFAULT_PORT_SERVER);
    });
  }
}

export default Server;
