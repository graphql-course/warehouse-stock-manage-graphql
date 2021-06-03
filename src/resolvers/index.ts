import path from "path";
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

// console.log(path.join(__dirname, './**/*.resolver.ts'));
const resolversFilesExtension =
  process.env.NODE_ENV !== "production" ? "./**/*.ts" : "./**/*.js";
const resolversArray = loadFilesSync(path.join(__dirname, resolversFilesExtension));
// console.log(resolversArray);
const resolvers = mergeResolvers(resolversArray);

export default resolvers;
