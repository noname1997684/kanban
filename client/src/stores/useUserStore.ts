import type { UserState } from "@/type/UserInterface";
import { create } from "zustand";

export const useUserStore = create<UserState>((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  loginState: "login",
  setLoginState: (state: "login" | "signup") => set({ loginState: state }),
  setUser: (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
  set({ user });
},
  logout: async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
      });
      set({ loginState: "login" });
      localStorage.removeItem("user");
      set({ user: null });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
