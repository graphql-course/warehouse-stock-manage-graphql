import { IJwt } from "./../interfaces/jwt.interface";
import { SECRET_KEY, EXPIRETIME, MESSAGES, machineUUID } from "./../config/constants";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";

class JWT {
  private secretKey = SECRET_KEY as string;
  // Información del payload con fecha de caducidad 24 horas por defecto
  sign(data: IJwt, expiresIn: number = EXPIRETIME.H24) {
    return jwt.sign({ user: data.user, uuid: data.uuid }, this.secretKey, {
      expiresIn,
    });
  }

  async verify(token: string) {
    try {
      if (
        (jwtDecode(token) as IJwt).uuid !== machineUUID()) {
        return MESSAGES.TOKEN_IN_THIS_MACHINE;
      }
      return jwt.verify(token, this.secretKey);
    } catch (e) {
      return MESSAGES.TOKEN_VERICATION_FAILED;
    }
  }
}

export default JWT;
