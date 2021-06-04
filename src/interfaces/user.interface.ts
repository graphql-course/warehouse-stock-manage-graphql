export interface IUser {
  id?: string;
  name?: string;
  lastname?: string;
  email: string;
  password?: string | '';
  registerDate?: string;
  role?: string;
  active: boolean;
}
