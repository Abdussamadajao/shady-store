import { useState } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/hook-form";
import { RHFTextField, RHFSelect } from "@/components/hook-form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/api/hooks/address";
import type { Address } from "@/api/service/address";

const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone number is required"),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressManagement = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "SHIPPING",
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    },
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    form.reset({
      type: "SHIPPING",
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      isDefault: false,
    });
    setShowForm(true);
    setIsAddingAddress(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || "",
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setShowForm(true);
    setIsAddingAddress(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setIsAddingAddress(false);
    form.reset();
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (isAddingAddress) {
        await createAddress.mutateAsync(data);
        toast.success("Address added successfully");
      } else if (editingAddress) {
        await updateAddress.mutateAsync({
          id: editingAddress.id,
          data,
        });
        toast.success("Address updated successfully");
      }
      handleCancel();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress.mutateAsync(id);
        toast.success("Address deleted successfully");
      } catch (error) {
        // Error handling is done in the mutation hooks
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress.mutateAsync(id);
      toast.success("Default address updated");
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "SHIPPING":
        return "bg-blue-100 text-blue-800";
      case "BILLING":
        return "bg-green-100 text-green-800";
      case "BOTH":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
          <p className="text-gray-600 mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-secondary hover:bg-secondary-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Address Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingAddress ? "Add New Address" : "Edit Address"}
            </DialogTitle>
            <DialogDescription>
              {isAddingAddress
                ? "Add a new shipping or billing address to your account."
                : "Update your address information."}
            </DialogDescription>
          </DialogHeader>

          <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFSelect
                name="type"
                label="Address Type"
                options={[
                  { value: "SHIPPING", label: "Shipping Address" },
                  { value: "BILLING", label: "Billing Address" },
                  { value: "BOTH", label: "Both" },
                ]}
              />
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...form.register("isDefault")}
                  className="rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default
                </label>
              </div>
            </div>

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
            </div>

            <RHFTextField
              name="company"
              label="Company (Optional)"
              inputProps={{ placeholder: "Enter company name" }}
            />

            <RHFTextField
              name="address1"
              label="Address Line 1"
              inputProps={{ placeholder: "Enter street address" }}
            />

            <RHFTextField
              name="address2"
              label="Address Line 2 (Optional)"
              inputProps={{ placeholder: "Apartment, suite, etc." }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RHFTextField
                name="city"
                label="City"
                inputProps={{ placeholder: "Enter city" }}
              />
              <RHFTextField
                name="state"
                label="State/Province"
                inputProps={{ placeholder: "Enter state" }}
              />
              <RHFTextField
                name="postalCode"
                label="Postal Code"
                inputProps={{ placeholder: "Enter postal code" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFTextField
                name="country"
                label="Country"
                inputProps={{ placeholder: "Enter country" }}
              />
              <RHFTextField
                name="phone"
                label="Phone Number"
                inputProps={{
                  type: "tel",
                  placeholder: "+1 (555) 123-4567",
                }}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createAddress.isPending || updateAddress.isPending}
                className="bg-secondary hover:bg-secondary-100"
              >
                {isAddingAddress ? "Add Address" : "Update Address"}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card key={address.id} className="relative">
            <CardContent className="p-6">
              {/* Address Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={getTypeBadgeColor(address.type)}>
                  {address.type}
                </Badge>
                {address.isDefault && (
                  <Badge className="bg-secondary text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <div className="font-medium">
                  {address.firstName} {address.lastName}
                </div>
                {address.company && (
                  <div className="text-gray-600">{address.company}</div>
                )}
                <div className="text-gray-700">{address.address1}</div>
                {address.address2 && (
                  <div className="text-gray-700">{address.address2}</div>
                )}
                <div className="text-gray-700">
                  {address.city}, {address.state} {address.postalCode}
                </div>
                <div className="text-gray-700">{address.country}</div>
                <div className="text-gray-700">{address.phone}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>

                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-secondary hover:text-secondary-100"
                  >
                    <StarOff className="h-4 w-4 mr-1" />
                    Set Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first address to get started with shipping and billing.
            </p>
            <Button
              onClick={handleAddNew}
              className="bg-secondary hover:bg-secondary-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddressManagement;
