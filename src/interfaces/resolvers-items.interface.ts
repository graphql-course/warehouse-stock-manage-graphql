import { PubSub } from 'apollo-server-express';
import { IUser } from './user.interface';
import { IPaginationOptions } from './pagination-options.interface';
import { Db } from 'mongodb';

export interface IVariables {
    id?: string | number;
    genre?: string;
    tag?: string;
    user?: IUser;
    pagination?: IPaginationOptions;
}

export interface IContextData {
    db?: Db;
    token?: string;
    uuid?: string;
    pubsub?: PubSub
}