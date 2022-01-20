const dataResolvers = {
    Data: {
      __resolveType(obj: { description: string; name: string }) {
        if (obj.description) {
          return "Product";
        }
        if (obj.name) {
          return "User";
        }
        return null; // GraphQLError is thrown
      },
    },
  };
  
  export default dataResolvers;