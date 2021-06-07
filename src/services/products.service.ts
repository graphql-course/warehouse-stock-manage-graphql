import { ACTIVE_VALUES_FILTER } from "./../config/constants";
import { findOneElement } from "./../lib/db-operations";
import { COLLECTIONS } from "../config/constants";
import ResolversService from "./resolvers.service";
import { IContextData } from "../interfaces/resolvers-items.interface";
class ProductsService extends ResolversService {
  private collection = COLLECTIONS.PRODUCTS;
  constructor(variables: object, context: IContextData) {
    super(variables, context);
  }

  // Lista de usuarios
  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: false };
    }
    console.log(this.getVariables());
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      "productos",
      page,
      itemsPage,
      filter
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      list: result.items,
    };
  }

  async details() {
    const filter = { id: this.getVariables().id };
    const result = await this.get(this.collection, filter);
    return { status: result.status, message: result.message, item: result.item };
  }
  
  // Añadir
  async insert() {
    const tokenValid = await this.verifyBeforeMutation();
    const product = this.getVariables().product;
    console.log(tokenValid, product)
    // comprobar que product no es null
    if ( !tokenValid || product === null ) {
      return {
        status: false,
        message: (!tokenValid && product !== null ) ?
                "Necesitas un token válido y debes de ser ADMIN":
                "Producto no definido, procura definirlo",
        item: null,
      };
    }
    
    // Comprobar que el usuario no existe
    const productCheck = await findOneElement(this.getDb(), this.collection, {
      id: product?.id,
    });

    if (productCheck !== null) {
      return {
        status: false,
        message: `El producto ${product?.id} está registrado. Prueba con otro`,
        item: null,
      };
    }

    product!.active = false;

    const result = await this.add(this.collection, product || {}, "producto");
    const item = result.item;
    // Guardar el documento (registro) en la colección
    /*
    Actualizar con un cambio
    if (result.status) {
        this.getPubSub().publish(UPDATE_STOCK, {
            changeStock: (await this.list(this.collection, 'productos')).items,
        });
    }*/
    return {
      status: result.status,
      message: result.message,
      item,
    };
  }
  // Modificar un usuario
  async modify() {
    const tokenValid = this.verifyBeforeMutation();
    const product = this.getVariables().product;
    // comprobar que product no es null
    if (product === null || !tokenValid) {
      return {
        status: false,
        message: (!tokenValid && product !== null ) ?
                "Necesitas un token válido y debes de":
                "Producto no definido, procura definirlo",
        item: null,
      };
    }
    const filter = { id: product?.id };
    const result = await this.update(
      this.collection,
      filter,
      product || {},
      "producto"
    );
    return {
      status: result.status,
      message: result.message,
      item: result.item,
    };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
}

export default ProductsService;
