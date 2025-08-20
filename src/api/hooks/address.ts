import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi, type AddressData } from "../service/address";
import { toast } from "sonner";

// Hook to get all addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAddresses,
    select: (data) => data.addresses,
  });
};

// Hook to get addresses by type
export const useAddressesByType = (type: "SHIPPING" | "BILLING" | "BOTH") => {
  return useQuery({
    queryKey: ["addresses", "type", type],
    queryFn: () => addressApi.getAddressesByType(type),
    select: (data) => data.addresses,
    enabled: !!type,
  });
};

// Hook to get single address
export const useAddress = (id: string) => {
  return useQuery({
    queryKey: ["addresses", id],
    queryFn: () => addressApi.getAddress(id),
    select: (data) => data.address,
    enabled: !!id,
  });
};

// Hook to create address
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating address:", error);
      toast.error(error?.response?.data?.error || "Failed to create address");
    },
  });
};

// Hook to update address
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddressData> }) =>
      addressApi.updateAddress(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses", id] });
      toast.success("Address updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating address:", error);
      toast.error(error?.response?.data?.error || "Failed to update address");
    },
  });
};

// Hook to delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting address:", error);
      toast.error(error?.response?.data?.error || "Failed to delete address");
    },
  });
};

// Hook to set default address
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Default address updated");
    },
    onError: (error: any) => {
      console.error("Error setting default address:", error);
      toast.error(
        error?.response?.data?.error || "Failed to set default address"
      );
    },
  });
};
