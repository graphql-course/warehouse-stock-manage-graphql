import { UPDATE_STOCK } from "../../config/constants";
import { PubSub, withFilter } from "graphql-subscriptions";

const subscriptionResolvers = {
  Subscription: {
    /*changeVotes: {
      resolve: (payload: {changeVotes: unknown}) =>
        payload.changeVotes,
      subscribe: async (_: unknown, __: unknown, context: { db: Db, pubsub: PubSub}) =>
        context.pubsub.asyncIterator([UPDATE_STOCK]),
    },*/
    changeStock: {
      subscribe: withFilter(
        (_: void, __: unknown, context: { pubsub: PubSub }) =>
          context.pubsub.asyncIterator(UPDATE_STOCK),
        (
          payload: { changeStock: { id: string | number } },
          variables: { id: string | number }
        ) => {
          return payload.changeStock.id === variables.id;
        }
      ),
    },
  },
};

export default subscriptionResolvers;
