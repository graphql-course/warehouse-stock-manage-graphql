import environments from './environments';

if (process.env.NODE_ENV !== 'production') {
    const environment = environments;
}

export const DATABASE_DEFAULT = "mongodb://localhost:27017/warehouse-management";

// Añade tus constantes aquí, si hace falta cogiendo de las variables de entorno

export const enum COLLECTIONS {
    PRODUCTS = 'products'
}

export const UPDATE_STOCK = 'UPDATE_STOCK';

export enum CURRENCIES_LIST {
    EUR = '€',
    DOLLAR= '$',
    YEN= '¥',
    POUND= '£'
};