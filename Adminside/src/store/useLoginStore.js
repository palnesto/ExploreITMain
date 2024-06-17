import { create } from "zustand";

const useLoginStore = create((set) => ({
  token: sessionStorage.getItem("token") || null,
  isLoggedIn: !!sessionStorage.getItem("token"),
  login: (token) => {
    sessionStorage.setItem("token", token);
    set({ token, isLoggedIn: true });
  },
  logout: () => {
    sessionStorage.removeItem("token");
    set({ token: null, isLoggedIn: false });
  },
}));

export default useLoginStore;
