export interface Token {
  // user id для получения данных из JWT.
    user_id: number;
    email: string;
    username: string;
    exp: number;
    orig_iat: number;
}
