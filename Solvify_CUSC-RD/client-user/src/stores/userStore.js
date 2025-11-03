// client-user/src/stores/userStore.js
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  setUser: (user) => {
    // Đảm bảo luôn có _id, kể cả khi backend trả về id (phòng trường hợp cũ)
    const fixedUser = { ...user, _id: user._id || user.id };
    localStorage.setItem("user", JSON.stringify(fixedUser));
    set({ user: fixedUser });
  },
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useUserStore;
