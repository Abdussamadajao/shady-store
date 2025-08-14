# Zustand Store for Product Management

This Zustand store provides comprehensive state management for product filtering and cart functionality.

## Features

### 🛍️ Product Filtering
- **Category Filtering**: Filter products by category (All, Fruits & Vegetables, Dairy, etc.)
- **Search Functionality**: Search products by name or category
- **Real-time Updates**: Filtered results update automatically

### 🛒 Cart Management
- **Add/Remove Items**: Add products to cart or remove them
- **Quantity Management**: Increase/decrease item quantities
- **Cart Totals**: Automatic calculation of total price and item count
- **Persistent State**: Cart state persists across component re-renders

## Store Structure

```typescript
interface StoreState {
  // Products and filtering
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  
  // Cart
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  filterProducts: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (productId: string) => number;
}
```

## Usage Examples

### Product Filtering

```tsx
import { useProducts, getCategories } from '../store/useStore';

const ProductFilter = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useProducts();
  
  const categories = getCategories();

  return (
    <div>
      {/* Search Input */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      
      {/* Category Buttons */}
      {categories.map(category => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={selectedCategory === category ? 'active' : ''}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
```

### Cart Management

```tsx
import { useCart } from '../store/useStore';

const CartComponent = () => {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    addToCart, 
    removeFromCart,
    updateCartItemQuantity,
    clearCart 
  } = useCart();

  return (
    <div>
      <h2>Cart ({cartItemCount} items)</h2>
      
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>Quantity: {item.quantity}</span>
          <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}
      
      <div>Total: ${cartTotal.toFixed(2)}</div>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};
```

### Product Display with Cart Integration

```tsx
import { useCart } from '../store/useStore';

const ProductCard = ({ product }) => {
  const { addToCart, getCartItemQuantity, updateCartItemQuantity } = useCart();
  const cartQuantity = getCartItemQuantity(product.id);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {cartQuantity > 0 ? (
        <div>
          <button onClick={() => updateCartItemQuantity(product.id, cartQuantity - 1)}>
            -
          </button>
          <span>{cartQuantity}</span>
          <button onClick={() => updateCartItemQuantity(product.id, cartQuantity + 1)}>
            +
          </button>
        </div>
      ) : (
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      )}
    </div>
  );
};
```

## Performance Optimizations

- **Selector Hooks**: Use `useProducts()` and `useCart()` for better performance
- **Automatic Filtering**: Products are filtered automatically when category or search changes
- **Efficient Updates**: Only necessary state updates trigger re-renders

## Available Categories

The store automatically generates categories from your product data:
- All
- Fruits & Vegetables
- Dairy
- Meat & Fish
- Snack
- Home & Cleaning
- Beverages
- Bakery

## Cart Persistence

The cart state persists across component re-renders and page navigation within the same session. For permanent persistence, consider adding localStorage integration:

```typescript
// In the store creation
const savedCart = localStorage.getItem('cart');
const initialState = savedCart ? JSON.parse(savedCart) : { cart: [] };

// Save cart to localStorage on changes
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
```
