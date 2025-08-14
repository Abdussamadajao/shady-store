import { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useCartItems, useCartTotal } from "@/store/cart";
import {
  useAddresses,
  useSelectedAddressId,
  useContacts,
  useSelectedContactId,
  useDeliveryOptions,
  useSelectedDeliveryTime,
  useDeliveryFee,
  type Address,
  type Contact,
  useCheckoutStore,
} from "@/store/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Check, X } from "lucide-react";
import { formatNGN } from "@/utils/currency";

// Using Zustand stores instead of local state interfaces

const Cart: React.FC = () => {
  // Auto-scroll to top when navigating to cart
  useScrollToTop();

  const cartItems = useCartItems();
  const cartTotal = useCartTotal();

  // Checkout store
  const addresses = useAddresses();
  const selectedAddressId = useSelectedAddressId();
  const contacts = useContacts();
  const selectedContactId = useSelectedContactId();
  const deliveryOptions = useDeliveryOptions();
  const selectedDeliveryTime = useSelectedDeliveryTime();
  const deliveryFee = useDeliveryFee();

  const {
    addAddress,
    deleteAddress,
    selectAddress,
    // setDefaultAddress,
    addContact,
    deleteContact,
    selectContact,
    // setDefaultContact,
    setSelectedTime,
  } = useCheckoutStore();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Address functions
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

  // const _handleSetDefaultAddress = (id: string) => {
  //   setDefaultAddress(id);
  //     selectAddress(id);
  //   };

  // Contact functions
  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.phone || !contactForm.email) {
      alert("Please fill in all contact fields");
      return;
    }

    addContact(contactForm);
    setContactForm({
      name: "",
      phone: "",
      email: "",
    });
    setShowContactForm(false);
  };

  const handleEditContact = (contact: Contact) => {
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    });
    setShowContactForm(true);
  };

  const handleDeleteContact = (id: string) => {
    deleteContact(id);
  };

  // const handleSetDefaultContact = (id: string) => {
  //   setDefaultContact(id);
  //   selectContact(id);
  // };

  // Payment functions
  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces every 4 digits
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setPaymentForm({ ...paymentForm, cardNumber: formatted });
  };

  const handleExpiryDateChange = (value: string) => {
    // Format expiry date as MM/YY
    const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
    setPaymentForm({ ...paymentForm, expiryDate: formatted });
  };

  const handleCVVChange = (value: string) => {
    // Only allow 3-4 digits
    const formatted = value.replace(/\D/g, "").slice(0, 4);
    setPaymentForm({ ...paymentForm, cvv: formatted });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }
    if (!selectedContactId) {
      alert("Please select a contact number");
      return;
    }
    if (
      !paymentForm.cardNumber ||
      !paymentForm.expiryDate ||
      !paymentForm.cvv ||
      !paymentForm.cardholderName
    ) {
      alert("Please fill in all payment information");
      return;
    }

    // Handle order placement logic here
    console.log("Placing order with:", {
      address: addresses.find((addr) => addr.id === selectedAddressId),
      contact: contacts.find((contact) => contact.id === selectedContactId),
      payment: paymentForm,
      deliveryTime: selectedDeliveryTime,
      deliveryFee: deliveryFee,
      items: cartItems,
      subtotal: cartTotal,
      total: cartTotal + deliveryFee,
    });

    alert("Order placed successfully!");
  };

  const isFormValid =
    selectedAddressId &&
    selectedContactId &&
    paymentForm.cardNumber &&
    paymentForm.expiryDate &&
    paymentForm.cvv &&
    paymentForm.cardholderName;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Delivery Address */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedAddressId ? "bg-green-600" : "bg-gray-400"
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
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.address}
                            </p>
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

            {/* Step 2: Contact Number */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedContactId ? "bg-secondary" : "bg-gray-400"
                    }`}
                  >
                    {selectedContactId ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <CardTitle className="text-lg">Contact Number</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.length > 0 && (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedContactId === contact.id
                            ? "border-secondary bg-transparent"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => selectContact(contact.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-800">
                                {contact.name}
                              </h4>
                              {contact.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {contact.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {contact.email}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditContact(contact);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteContact(contact.id);
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

                {showContactForm ? (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Name</Label>
                        <Input
                          id="contactName"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter contact name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleAddContact}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Contact
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowContactForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => setShowContactForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Delivery Schedule */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    3
                  </div>
                  <CardTitle className="text-lg">Delivery Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedTime(option.id)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDeliveryTime === option.id
                          ? "border-secondary bg-transparent"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </div>
                      <div className="text-xs font-medium text-secondary mt-1">
                        {formatNGN(option.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Payment */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      paymentForm.cardNumber &&
                      paymentForm.expiryDate &&
                      paymentForm.cvv &&
                      paymentForm.cardholderName
                        ? "bg-secondary"
                        : "bg-gray-400"
                    }`}
                  >
                    {paymentForm.cardNumber &&
                    paymentForm.expiryDate &&
                    paymentForm.cvv &&
                    paymentForm.cardholderName ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      "4"
                    )}
                  </div>
                  <CardTitle className="text-lg">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentForm.cardholderName}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          cardholderName: e.target.value,
                        })
                      }
                      placeholder="Enter cardholder name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handleExpiryDateChange(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentForm.cvv}
                      onChange={(e) => handleCVVChange(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  By making this purchase you agree to our{" "}
                  <span className="text-red-600 font-medium">
                    terms and conditions
                  </span>
                  .
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-[100px]">
              <CardHeader>
                <CardTitle className="text-xl">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🛒</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {formatNGN(
                            typeof item.price === "string"
                              ? parseFloat(item.price)
                              : item.price
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x{" "}
                          {formatNGN(
                            typeof item.price === "string"
                              ? parseFloat(item.price)
                              : item.price
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium">{formatNGN(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {formatNGN(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>{formatNGN(cartTotal + deliveryFee)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-secondary hover:bg-secondary-100 py-3 text-lg font-medium"
                  disabled={!isFormValid || cartItems.length === 0}
                >
                  Place Order
                </Button>

                {/* Form Validation Status */}
                {!isFormValid && (
                  <div className="text-sm text-red-600 space-y-1">
                    {!selectedAddressId && (
                      <p>• Please select a delivery address</p>
                    )}
                    {!selectedContactId && (
                      <p>• Please select a contact number</p>
                    )}
                    {(!paymentForm.cardNumber ||
                      !paymentForm.expiryDate ||
                      !paymentForm.cvv ||
                      !paymentForm.cardholderName) && (
                      <p>• Please complete payment information</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
