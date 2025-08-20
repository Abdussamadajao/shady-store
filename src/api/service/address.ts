import { axiosInstance } from "@/lib/axios";

export interface AddressData {
  type: "SHIPPING" | "BILLING" | "BOTH";
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Address extends AddressData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const addressApi = {
  // Get all addresses for current user
  getAddresses: async (): Promise<{ addresses: Address[] }> => {
    const response = await axiosInstance.get("/addresses");
    return response.data;
  },

  // Get single address by ID
  getAddress: async (id: string): Promise<{ address: Address }> => {
    const response = await axiosInstance.get(`/addresses/${id}`);
    return response.data;
  },

  // Create new address
  createAddress: async (data: AddressData): Promise<{ address: Address }> => {
    const response = await axiosInstance.post("/addresses", data);
    return response.data;
  },

  // Update address
  updateAddress: async (
    id: string,
    data: Partial<AddressData>
  ): Promise<{ address: Address }> => {
    const response = await axiosInstance.put(`/addresses/${id}`, data);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/addresses/${id}`);
    return response.data;
  },

  // Set address as default
  setDefaultAddress: async (id: string): Promise<{ address: Address }> => {
    const response = await axiosInstance.patch(`/addresses/${id}/default`);
    return response.data;
  },

  // Get addresses by type
  getAddressesByType: async (
    type: "SHIPPING" | "BILLING" | "BOTH"
  ): Promise<{ addresses: Address[] }> => {
    const response = await axiosInstance.get(`/addresses/type/${type}`);
    return response.data;
  },
};
