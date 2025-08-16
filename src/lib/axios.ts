import { PATH_AUTH } from "@/routes/paths";
import axios from "axios";
import { toast } from "sonner";
import { storeManager } from "./store-manager";

function createAxiosInstance() {
  const instance = axios.create({
    baseURL: "/api",
    timeout: 10_000,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => config,
    (error) => {
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Don't log the full error object to prevent circular reference issues
      console.log("Response Error:", {
        url: error?.config?.url,
        status: error?.response?.status,
        message: error?.message,
      });

      if (error?.response?.status === 403) {
        toast.error("Session expired. Please login again");

        const currentPath = window.location.pathname;
        if (!currentPath.includes(PATH_AUTH.login)) {
          console.log(
            "Unauthorized/Forbidden - Clearing token and redirecting to login"
          );
          // storeManager.clearAll();
          window.location.href = PATH_AUTH.login;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Initialize the axios instance
export const axiosInstance = createAxiosInstance();
