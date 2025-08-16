import { COOKIE_KEY } from "@/constants/app";
import Cookies from "js-cookie";

export const storeManager = {
  getCookies(): string | null {
    return Cookies.get(COOKIE_KEY) || null;
  },

  clearCookies() {
    Cookies.remove(COOKIE_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getCookies();
  },

  clearAll() {
    Cookies.remove(COOKIE_KEY);
  },
};
