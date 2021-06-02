import { createServer, Server as HTTPServer } from "http";
import cors from "cors";
import compression from "compression";
import express, { Application } from "express";
import { GraphQLSchema } from "graphql";
import { ApolloServer, PubSub } from "apollo-server-express";
import expressPlayGround from "graphql-playground-middleware-express";
import depthLimit from 'graphql-depth-limit';
import Database from './config/database';
class Server {
  private app!: Application;
  private httpServer!: HTTPServer;
  private schema!: GraphQLSchema;
  private database!: Database;
  private pubsub!: PubSub;
  private readonly DEFAULT_PORT_SERVER =
    process.env.PORT || 3003;
  private server!: ApolloServer;
  constructor(schema: GraphQLSchema) {
    if (schema === undefined) {
      throw new Error("Need GraphQL Schema to work in API GraphQL");
    }
    this.schema = schema;
    this.initialize();
  }

  /**
   * Inicializar todas las configuraciones establecidas en el servidor
   */
  private initialize() {
    this.configExpress();
    this.initializeDbPubSub();
    this.configApolloServer();
    this.configRoutes();
    this.createServer();
  }

  private configExpress() {
    this.app = express();

    this.app.use(cors());

    this.app.use(compression());
  }

  private async initializeDbPubSub() {
    this.database = new Database();
    this.pubsub = new PubSub();
  }

  private async configApolloServer() {
    // COnfigurar el servidor apollo server

    this.server = new ApolloServer({
      schema: this.schema,
      context: async() => {
        return { db: await this.database.init(), pubsub: this.pubsub };
      },
      introspection: true,
      playground: true,
      validationRules: [ depthLimit(4) ],
      
    });

    this.server.applyMiddleware({ app: this.app });
    
    
  }

  private configRoutes() {
    this.app.use("/hello", (_, res) => {
      res.send("Bienvenidos/as al curso de GraphQL desde 0");
    });

    this.app.use(
      "/",
      expressPlayGround({
        endpoint: "/graphql",
      })
    );
  }

  private createServer() {
    this.httpServer = createServer(this.app);
    this.server.installSubscriptionHandlers(this.httpServer);
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT_SERVER, () => {
      callback(+this.DEFAULT_PORT_SERVER);
    });
  }
}

export default Server;
