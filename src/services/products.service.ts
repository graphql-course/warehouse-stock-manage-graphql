import { ACTIVE_VALUES_FILTER, UPDATE_STOCK } from "./../config/constants";
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
  
  // Añadir
  async insert() {
    const product = this.getVariables().product;

    // comprobar que product no es null
    if (product === null) {
      return {
        status: false,
        message: "Producto no definido, procura definirlo",
        item: null,
      };
    }
    
    // Comprobar que el usuario no existe
    const productCheck = await findOneElement(this.getDb(), this.collection, {
      code: product?.code,
    });

    if (productCheck !== null) {
      return {
        status: false,
        message: `El producto ${product?.code} está registrado. Prueba con otro`,
        item: null,
      };
    }

    product!.active = false;

    const result = await this.add(this.collection, product || {}, "producto");
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
      item: result.item,
    };
  }
  // Modificar un usuario
  async modify() {
    
    const product = this.getVariables().product;
    // comprobar que product no es null
    if (product === null) {
      return {
        status: false,
        message: "Producto no definido, procura definirlo",
        item: null,
      };
    }
    const filter = { code: product?.code };
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
  async unblock(unblock: boolean, admin: boolean) {
    const id = this.getVariables().id;
    const product = this.getVariables().product;
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El ID del usuario no se ha especificado correctamente",
        item: null,
      };
    }
  
    let update = { active: unblock };
   
    const result = await this.update(
      this.collection,
      { id },
      update,
      "usuario"
    );
    const action = unblock ? "Desbloqueado" : "Bloqueado";
    return {
      status: result.status,
      message: result.status
        ? `${action} correctamente`
        : `No se ha ${action.toLowerCase()} comprobarlo por favor`,
    };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
}

export default ProductsService;
