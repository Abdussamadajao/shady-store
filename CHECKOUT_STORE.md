# Consolidated Checkout Store with Zustand

This document explains the consolidated checkout store that manages all checkout-related state including addresses, contacts, payment methods, and delivery preferences.

## Overview

The checkout store is a single Zustand store that consolidates all checkout functionality into one place, providing:
- **Unified State Management** - All checkout data in one store
- **Automatic Persistence** - Data saved to localStorage
- **Type Safety** - Full TypeScript support
- **Optimized Performance** - Efficient selectors and actions

## Store Structure

### State Interface
```typescript
interface CheckoutState {
  // Address state
  addresses: Address[];
  selectedAddressId: string | null;
  
  // Contact state
  contacts: Contact[];
  selectedContactId: string | null;
  
  // Payment state
  paymentMethods: PaymentInfo[];
  selectedPaymentId: string | null;
  
  // Delivery state
  deliveryOptions: DeliveryOption[];
  deliveryPreferences: DeliveryPreferences;
}
```

### Data Types

#### Address
```typescript
interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
}
```

#### Contact
```typescript
interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  isDefault: boolean;
  createdAt: Date;
}
```

#### PaymentInfo
```typescript
interface PaymentInfo {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: Date;
}
```

#### DeliveryOption
```typescript
interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  time: string;
  price: number; // Price in Naira (₦)
  isAvailable: boolean;
}
```

#### DeliveryPreferences
```typescript
interface DeliveryPreferences {
  selectedTimeId: string;
  deliveryInstructions: string;
  preferredDate: string | null;
}
```

## Actions

### Address Actions
- `addAddress(address)` - Add new delivery address
- `updateAddress(id, updates)` - Update existing address
- `deleteAddress(id)` - Remove address
- `selectAddress(id)` - Set selected address
- `setDefaultAddress(id)` - Mark address as default
- `clearAddresses()` - Remove all addresses
- `getAddressById(id)` - Get address by ID
- `getDefaultAddress()` - Get default address

### Contact Actions
- `addContact(contact)` - Add new contact
- `updateContact(id, updates)` - Update existing contact
- `deleteContact(id)` - Remove contact
- `selectContact(id)` - Set selected contact
- `setDefaultContact(id)` - Mark contact as default
- `clearContacts()` - Remove all contacts
- `getContactById(id)` - Get contact by ID
- `getDefaultContact()` - Get default contact

### Payment Actions
- `addPaymentMethod(payment)` - Add new payment method
- `updatePaymentMethod(id, updates)` - Update payment method
- `deletePaymentMethod(id)` - Remove payment method
- `selectPaymentMethod(id)` - Set selected payment method
- `setDefaultPaymentMethod(id)` - Mark payment method as default
- `clearPaymentMethods()` - Remove all payment methods
- `getPaymentMethodById(id)` - Get payment method by ID
- `getDefaultPaymentMethod()` - Get default payment method
- `validatePaymentInfo(payment)` - Validate payment data

### Delivery Actions
- `setSelectedTime(timeId)` - Set delivery time
- `setDeliveryInstructions(instructions)` - Set delivery notes
- `setPreferredDate(date)` - Set preferred delivery date
- `resetDeliveryPreferences()` - Reset to defaults
- `getSelectedDeliveryOption()` - Get selected delivery option
- `isDeliveryTimeSelected()` - Check if time is selected

### Utility Actions
- `resetAll()` - Clear all checkout data
- `isCheckoutComplete()` - Check if all required fields are filled

## Selector Hooks

### Address Selectors
```typescript
const addresses = useAddresses();
const selectedAddressId = useSelectedAddressId();
const selectedAddress = useSelectedAddress();
const defaultAddress = useDefaultAddress();
```

### Contact Selectors
```typescript
const contacts = useContacts();
const selectedContactId = useSelectedContactId();
const selectedContact = useSelectedContact();
const defaultContact = useDefaultContact();
```

### Payment Selectors
```typescript
const paymentMethods = usePaymentMethods();
const selectedPaymentId = useSelectedPaymentId();
const selectedPaymentMethod = useSelectedPaymentMethod();
const defaultPaymentMethod = useDefaultPaymentMethod();
```

### Delivery Selectors
```typescript
const deliveryOptions = useDeliveryOptions();
const deliveryPreferences = useDeliveryPreferences();
const selectedDeliveryTime = useSelectedDeliveryTime();
const selectedDeliveryOption = useSelectedDeliveryOption();
const deliveryFee = useDeliveryFee(); // Get current delivery fee in Naira
```

### Action Hooks
```typescript
const {
  addAddress,
  deleteAddress,
  selectAddress,
  // ... all other actions
} = useCheckoutActions();
```

## Usage Examples

### Basic Setup
```typescript
import {
  useAddresses,
  useSelectedAddressId,
  useCheckoutActions,
  type Address
} from '@/store/checkout';

const Cart = () => {
  const addresses = useAddresses();
  const selectedAddressId = useSelectedAddressId();
  const { addAddress, selectAddress } = useCheckoutActions();
  
  // Use the store...
};
```

### Adding an Address
```typescript
const handleAddAddress = () => {
  addAddress({
    fullName: "John Doe",
    phone: "+1234567890",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  });
};
```

### Selecting Delivery Time
```typescript
const { setSelectedTime } = useCheckoutActions();
const deliveryOptions = useDeliveryOptions();

const handleTimeSelect = (timeId: string) => {
  setSelectedTime(timeId);
};
```

### Getting Delivery Fee
```typescript
const deliveryFee = useDeliveryFee();
const totalWithDelivery = cartTotal + deliveryFee;

// Display delivery fee
console.log(`Delivery Fee: ${formatNGN(deliveryFee)}`);
```

### Checking Checkout Completion
```typescript
const { isCheckoutComplete } = useCheckoutActions();

const canPlaceOrder = isCheckoutComplete();
```

## Persistence

The store automatically persists all data to localStorage under the key `checkout-storage`:

```typescript
persist(
  (set, get) => ({ /* store implementation */ }),
  {
    name: "checkout-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      addresses: state.addresses,
      selectedAddressId: state.selectedAddressId,
      contacts: state.contacts,
      selectedContactId: state.selectedContactId,
      paymentMethods: state.paymentMethods,
      selectedPaymentId: state.selectedPaymentId,
      deliveryPreferences: state.deliveryPreferences,
    }),
  }
)
```

## Benefits

1. **Single Source of Truth** - All checkout data in one place
2. **Easier State Management** - No need to coordinate between multiple stores
3. **Better Performance** - Optimized selectors and reduced re-renders
4. **Simplified Imports** - One import for all checkout functionality
5. **Consistent API** - Uniform patterns across all checkout features
6. **Automatic Persistence** - Data survives page refreshes and browser restarts
7. **Real-time Delivery Fees** - Dynamic delivery fee calculation based on selected time
8. **Consistent Color Scheme** - Uses secondary and secondary-100 colors for better brand consistency

## Delivery Fee Structure

The store includes predefined delivery options with Naira pricing:

- **Express Delivery (90 min)**: ₦1,500
- **8am-11am**: ₦800
- **11am-2pm**: ₦800
- **2pm-5pm**: ₦800
- **5pm-8pm**: ₦800
- **Next Day**: ₦500

Delivery fees are automatically calculated and included in the total order amount.

## Migration from Individual Stores

If you were using the individual stores before:

```typescript
// Old way
import { useAddresses } from '@/store/address';
import { useContacts } from '@/store/contact';
import { usePaymentMethods } from '@/store/payment';
import { useDeliveryOptions } from '@/store/delivery';

// New way
import { 
  useAddresses, 
  useContacts, 
  usePaymentMethods, 
  useDeliveryOptions 
} from '@/store/checkout';
```

The API remains the same, just consolidated into one store!

## Testing

The store can be tested by:
1. Adding items to each category
2. Verifying persistence across page refreshes
3. Testing selection and default behaviors
4. Checking validation functions
5. Verifying reset functionality

## Troubleshooting

### Common Issues
- **Data not persisting**: Check localStorage permissions
- **Type errors**: Ensure all required fields are provided
- **Performance issues**: Use specific selectors instead of accessing entire state

### Debug Tips
- Check localStorage in DevTools
- Use `console.log` in store actions
- Verify selector dependencies
- Test individual actions in isolation
