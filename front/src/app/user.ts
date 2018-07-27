export interface User {
  // user id для получения данных из JWT.
    user_id: number;
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone: string;
    avatar: string;
}
