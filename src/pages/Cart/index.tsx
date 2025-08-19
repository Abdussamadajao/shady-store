import { useScrollToTop } from "@/hooks/useScrollToTop";
import useCartStore from "@/store/cart";
import {
  useAddresses,
  useSelectedAddressId,
  useContacts,
  useSelectedContactId,
  useSelectedDeliveryTime,
  useDeliveryFee,
} from "@/store/checkout";
import {
  DeliveryAddress,
  ContactNumber,
  DeliverySchedule,
  PaymentForm,
  OrderSummary,
  usePaymentForm,
} from "@/components/cart";

const Cart: React.FC = () => {
  useScrollToTop();
  const { items: cartItems } = useCartStore();

  // Checkout store
  const addresses = useAddresses();
  const selectedAddressId = useSelectedAddressId();
  const contacts = useContacts();
  const selectedContactId = useSelectedContactId();
  const selectedDeliveryTime = useSelectedDeliveryTime();
  const deliveryFee = useDeliveryFee();

  // Payment form hook
  const { paymentForm, isPaymentComplete } = usePaymentForm();

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address");
      return;
    }
    if (!selectedContactId) {
      alert("Please select a contact number");
      return;
    }
    if (!isPaymentComplete) {
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
    });

    alert("Order placed successfully!");
  };

  const isFormValid = Boolean(
    selectedAddressId && selectedContactId && isPaymentComplete
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            <DeliveryAddress />
            <ContactNumber />
            <DeliverySchedule />
            <PaymentForm />
          </div>

          {/* Right Column - Order Summary */}
          <OrderSummary
            onPlaceOrder={handlePlaceOrder}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
