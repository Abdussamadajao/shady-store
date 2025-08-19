import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Check, X } from "lucide-react";
import {
  useAddresses,
  useSelectedAddressId,
  useCheckoutStore,
  type Address,
} from "@/store/checkout";

const DeliveryAddress: React.FC = () => {
  const addresses = useAddresses();
  const selectedAddressId = useSelectedAddressId();
  const { addAddress, deleteAddress, selectAddress } = useCheckoutStore();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleAddAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode
    ) {
      alert("Please fill in all address fields");
      return;
    }

    addAddress(addressForm);
    setAddressForm({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setShowAddressForm(false);
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
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
                onClick={() => selectAddress(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {address.fullName}
                      </h4>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-secondary-100 text-secondary text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.id);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddressForm ? (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      city: e.target.value,
                    })
                  }
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      state: e.target.value,
                    })
                  }
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      zipCode: e.target.value,
                    })
                  }
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddAddress}
                className="bg-secondary hover:bg-secondary-100"
              >
                Save Address
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddressForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="text-secondary border-secondary hover:bg-secondary-100"
            onClick={() => setShowAddressForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryAddress;
