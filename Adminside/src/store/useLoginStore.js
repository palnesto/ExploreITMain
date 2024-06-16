import { create } from "zustand";

const useLoginStore = create((set) => ({
  isLoggedIn: sessionStorage.getItem("isLoggedIn") === "true",
  login: () => {
    sessionStorage.setItem("isLoggedIn", "true");
    set({ isLoggedIn: true });
  },
  logout: () => {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("token"); // Also remove the token
    set({ isLoggedIn: false });
  },
}));

export default useLoginStore;
