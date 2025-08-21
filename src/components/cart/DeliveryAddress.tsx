import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Check, X } from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/api/hooks";
import type { Address } from "@/api/service/address";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RHFTextField from "@/components/hook-form/rhf-textfield";
import RHFSelect from "@/components/hook-form/rhf-select";

// Form validation schema
const addressFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

interface DeliveryAddressProps {
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  selectedAddressId,
  onAddressSelect,
}) => {
  const { data: addressesData } = useAddresses();
  const addresses = addressesData || [];
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
      type: "SHIPPING",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      updateAddressMutation.mutate(
        { id: editingAddress.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingAddress(null);
            form.reset();
          },
        }
      );
    } else {
      createAddressMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      type: address.type,
    });
    setIsModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
              selectedAddressId ? "bg-secondary" : "bg-gray-400"
            }`}
          >
            {selectedAddressId ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <CardTitle className="text-lg">Delivery Address</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length > 0 && (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAddressId === address.id
                    ? "border-secondary bg-transparent"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onAddressSelect(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {address.firstName} {address.lastName}
                      </h4>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-secondary-100 text-white text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600">{address.address1}</p>
                    {address.address2 && (
                      <p className="text-sm text-gray-600">
                        {address.address2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      disabled={
                        updateAddressMutation.isPending ||
                        deleteAddressMutation.isPending
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      disabled={
                        updateAddressMutation.isPending ||
                        deleteAddressMutation.isPending
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="text-secondary hover:text-white border-secondary hover:bg-secondary-100"
          onClick={handleAddNewAddress}
          disabled={
            createAddressMutation.isPending ||
            updateAddressMutation.isPending ||
            deleteAddressMutation.isPending
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>

        {/* Address Form Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RHFTextField
                    name="firstName"
                    label="First Name"
                    inputProps={{ placeholder: "Enter first name" }}
                  />
                  <RHFTextField
                    name="lastName"
                    label="Last Name"
                    inputProps={{ placeholder: "Enter last name" }}
                  />
                  <RHFTextField
                    name="phone"
                    label="Phone Number"
                    inputProps={{ placeholder: "Enter phone number" }}
                  />
                  <RHFTextField
                    name="country"
                    label="Country"
                    inputProps={{ placeholder: "Enter country" }}
                  />
                  <RHFSelect
                    name="type"
                    label="Address Type"
                    placeholder="Select address type"
                    options={[
                      { label: "Shipping Address", value: "SHIPPING" },
                      { label: "Billing Address", value: "BILLING" },
                      { label: "Both", value: "BOTH" },
                    ]}
                  />
                  <div className="md:col-span-2">
                    <RHFTextField
                      name="address1"
                      label="Address Line 1"
                      inputProps={{ placeholder: "Enter street address" }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <RHFTextField
                      name="address2"
                      label="Address Line 2 (Optional)"
                      inputProps={{
                        placeholder: "Apartment, suite, etc. (optional)",
                      }}
                    />
                  </div>
                  <RHFTextField
                    name="city"
                    label="City"
                    inputProps={{ placeholder: "Enter city" }}
                  />
                  <RHFTextField
                    name="state"
                    label="State"
                    inputProps={{ placeholder: "Enter state" }}
                  />
                  <RHFTextField
                    name="postalCode"
                    label="Postal Code"
                    inputProps={{ placeholder: "Enter postal code" }}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={
                      createAddressMutation.isPending ||
                      updateAddressMutation.isPending
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-secondary hover:bg-secondary-100"
                    disabled={
                      createAddressMutation.isPending ||
                      updateAddressMutation.isPending
                    }
                  >
                    {createAddressMutation.isPending ||
                    updateAddressMutation.isPending
                      ? "Saving..."
                      : editingAddress
                      ? "Update Address"
                      : "Save Address"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeliveryAddress;
