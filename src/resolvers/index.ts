
import path from 'path';
 import { mergeResolvers }  from '@graphql-tools/merge';
 import { loadFilesSync } from '@graphql-tools/load-files';

 // console.log(path.join(__dirname, './**/*.resolver.ts'));
 const resolversArray = loadFilesSync(path.join(__dirname, './**/*.ts'));
 // console.log(resolversArray);
 const resolvers = mergeResolvers(resolversArray);

 export default resolvers;