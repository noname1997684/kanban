export interface AuthInput {
  username?: string;
  email?: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  boards: string[];
}

export interface UserState {
  user: User | null;
  loginState: "login" | "signup";
  setLoginState: (state: "login" | "signup") => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}
