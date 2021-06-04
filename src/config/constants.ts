import { machineIdSync } from 'node-machine-id';
import environments from './environments';

if (process.env.NODE_ENV !== 'production') {
    const environment = environments;
}

export const SECRET_KEY =
  process.env.SECRET || 'AnartzMugikaStockManagement2021';

export const DATABASE_DEFAULT = "mongodb://localhost:27017/warehouse-management";

// Añade tus constantes aquí, si hace falta cogiendo de las variables de entorno

export const enum COLLECTIONS {
    PRODUCTS = 'products',
    USERS = 'users'
}

export const UPDATE_STOCK = 'UPDATE_STOCK';

export enum CURRENCIES_LIST {
    EUR = '€',
    DOLLAR= '$',
    YEN= '¥',
    POUND= '£'
};

/**
 * H = Horas
 * M = Minutos
 * D = Días
 */
 export enum EXPIRETIME {
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D3 = H24 * 3
  }

  export enum ACTIVE_VALUES_FILTER {
    ALL = 'ALL',
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE'
  }

  export enum MESSAGES {
    TOKEN_VERICATION_FAILED = 'token no valido, inicia sesion de nuevo',
    TOKEN_IN_THIS_MACHINE = 'El token no se ha generado en esta máquina, inténtalo de nuevo'
  }

  export function machineUUID() { return machineIdSync(true); }