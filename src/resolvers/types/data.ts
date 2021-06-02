const dataResolvers = {
  Data: {
    __resolveType(obj: { code: string; name: string }) {
      if (obj.code) {
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