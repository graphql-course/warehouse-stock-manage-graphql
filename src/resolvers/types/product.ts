import { CURRENCIES_LIST } from "../../config/constants";

const productTypeResolvers = {
  Product: {
    price: ({price, currency}: any) => {
        const symbol = CURRENCIES_LIST[currency as keyof typeof CURRENCIES_LIST] ;
        return `${price} ${symbol}`;
    }
  },
};

export default productTypeResolvers;
