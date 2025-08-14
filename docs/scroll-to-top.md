# Scroll to Top Functionality

This project includes two approaches for automatically scrolling to the top when navigating between pages:

## 1. Global ScrollToTop Component (Recommended)

The `ScrollToTop` component is automatically included in the main `App.tsx` and will handle scrolling to top for all route changes.

**Location**: `src/components/shared/ScrollToTop.tsx`

**Features**:
- Automatically scrolls to top on all route changes
- Configurable scroll behavior (smooth, auto)
- Configurable scroll position (top, left)
- No need to add to individual pages

**Usage in App.tsx**:
```tsx
import { ScrollToTop } from "@/components/shared";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop /> {/* Automatically handles all routes */}
        <Routes>{renderRoutes(routes)}</Routes>
      </div>
    </BrowserRouter>
  );
}
```

## 2. Individual Page Hook

For pages that need custom scroll behavior, you can use the `useScrollToTop` hook.

**Location**: `src/hooks/useScrollToTop.ts`

**Features**:
- Page-specific scroll control
- Customizable scroll behavior
- Can be used alongside the global component

**Usage in individual pages**:
```tsx
import { useScrollToTop } from "@/hooks/useScrollToTop";

const ProductPage: React.FC = () => {
  // Auto-scroll to top when navigating to this page
  useScrollToTop();
  
  return (
    // Your component JSX
  );
};
```

## Configuration Options

### ScrollToTop Component Props

```tsx
<ScrollToTop 
  behavior="smooth"  // 'auto' | 'smooth'
  top={0}            // Scroll to top position
  left={0}           // Scroll to left position
/>
```

### useScrollToTop Hook

The hook automatically uses smooth scrolling to position (0, 0) but can be customized by modifying the hook implementation.

## Current Implementation

The following pages currently use the `useScrollToTop` hook:

- ✅ Home (`src/pages/Home/index.tsx`)
- ✅ Product Detail (`src/pages/Product/index.tsx`)
- ✅ Cart (`src/pages/Cart/index.tsx`)
- ✅ Checkout (`src/pages/Checkout/index.tsx`)
- ✅ Account (`src/pages/Account/index.tsx`)
- ✅ Login (`src/pages/auth/login.tsx`)
- ✅ Signup (`src/pages/auth/signup.tsx`)
- ✅ NotFound (`src/pages/NotFound/index.tsx`)

## Benefits

1. **Better UX**: Users always start viewing pages from the top
2. **Consistent Behavior**: All pages behave the same way
3. **Smooth Transitions**: Uses smooth scrolling for better visual experience
4. **Flexible**: Both global and page-specific approaches available
5. **Performance**: Lightweight implementation with minimal overhead

## Browser Compatibility

The scroll behavior is supported in all modern browsers. For older browsers, it gracefully falls back to instant scrolling.
