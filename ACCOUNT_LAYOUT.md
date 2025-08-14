# Account Layout System

## Overview

The Account Layout system provides a comprehensive user account management interface with a sidebar navigation containing Profile, Orders, and Settings sections. This layout is designed to give users easy access to all their account-related features in one organized interface.

## Architecture

### Layout Structure

```
AccountLayout
├── Sidebar (Left Column)
│   ├── User Info Section
│   ├── Navigation Menu
│   └── Logout Button
└── Main Content (Right Column)
    ├── Profile Page
    ├── Orders Page
    └── Settings Page
```

## Components

### 1. AccountLayout (`src/layouts/AccountLayout.tsx`)

The main layout component that provides the sidebar navigation and content area.

**Features:**
- Responsive sidebar navigation
- Active route highlighting
- Sticky sidebar positioning
- User avatar and account info display
- Logout functionality

**Props:** None (uses React Router hooks)

**Navigation Items:**
- **Profile** - Personal information management
- **Orders** - Order history and tracking
- **Settings** - Account preferences and security

### 2. Profile Page (`src/pages/Account/Profile.tsx`)

Comprehensive profile management with editable personal information.

**Features:**
- Editable personal information (name, email, phone)
- Address management
- Bio/About me section
- Account statistics display
- Inline editing with save/cancel functionality

**Sections:**
- Personal Information
- Address Information
- About Me
- Account Statistics

### 3. Orders Page (`src/pages/Account/Orders.tsx`)

Order management and tracking interface.

**Features:**
- Order statistics dashboard
- Order history with detailed information
- Status tracking (Processing, In Transit, Delivered)
- Order details (items, prices, delivery info)
- Action buttons for each order

**Order Statuses:**
- **Processing** - Order is being prepared
- **In Transit** - Order is on the way
- **Delivered** - Order has been delivered

**Statistics Cards:**
- Total Orders
- Delivered Orders
- In Transit Orders
- Processing Orders

### 4. Settings Page (`src/pages/Account/Settings.tsx`)

Comprehensive account settings and preferences management.

**Features:**
- Notification preferences
- Privacy settings
- User preferences (language, currency, timezone, theme)
- Security settings
- Account actions

**Settings Categories:**
- **Notifications** - Email, push, SMS, order updates, promotions
- **Privacy** - Profile visibility, order history, reviews, location sharing
- **Preferences** - Language, currency, timezone, theme
- **Security** - Two-factor auth, login notifications, session timeout

## Styling

### Color Scheme
- **Primary Colors**: Uses secondary color palette for consistency
- **Status Colors**: 
  - Green for completed/delivered items
  - Blue for in-transit items
  - Yellow for processing items
  - Red for logout and delete actions

### Responsive Design
- **Desktop**: Sidebar + main content in grid layout
- **Mobile**: Stacked layout with collapsible sidebar
- **Breakpoints**: Uses Tailwind CSS responsive classes

## Usage

### Basic Implementation

```tsx
import { AccountLayout } from '@/layouts/AccountLayout';
import { Profile, Orders, Settings } from '@/pages/Account';

// In your router configuration
<Route path="/account" element={<AccountLayout />}>
  <Route path="profile" element={<Profile />} />
  <Route path="orders" element={<Orders />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

### Navigation

The layout automatically handles:
- Active route highlighting
- Navigation state management
- Responsive behavior
- User authentication status

## Features

### 1. User Experience
- **Intuitive Navigation** - Clear sidebar with icons and labels
- **Active State Indication** - Current page is highlighted
- **Responsive Design** - Works on all device sizes
- **Consistent Styling** - Matches app design system

### 2. Profile Management
- **Editable Fields** - Inline editing for all profile information
- **Form Validation** - Input validation and error handling
- **Auto-save** - Changes are saved immediately
- **Statistics Display** - Visual representation of account activity

### 3. Order Tracking
- **Real-time Status** - Live order status updates
- **Detailed Information** - Complete order details and history
- **Action Buttons** - Quick access to order-related actions
- **Filtering** - Easy filtering by order status

### 4. Settings Management
- **Organized Categories** - Logical grouping of settings
- **Toggle Controls** - Easy on/off switches for preferences
- **Dropdown Selections** - Multiple choice options
- **Security Features** - Advanced security settings

## Data Management

### State Management
- **Local State** - Each page manages its own state
- **Form Handling** - Controlled inputs with validation
- **Data Persistence** - Settings and preferences are saved

### Mock Data
Currently uses mock data for demonstration:
- Sample user profile
- Sample order history
- Sample settings configuration

## Future Enhancements

### Planned Features
1. **Real-time Updates** - Live order status updates
2. **Data Persistence** - Save settings to backend
3. **Profile Picture** - Upload and manage profile images
4. **Order Notifications** - Push notifications for order updates
5. **Advanced Security** - Biometric authentication support

### Integration Points
1. **Authentication System** - User login/logout
2. **Order Management API** - Real order data
3. **User Profile API** - Profile data persistence
4. **Notification System** - Push notifications
5. **Analytics** - User behavior tracking

## Technical Details

### Dependencies
- **React Router** - Navigation and routing
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library

### Performance
- **Lazy Loading** - Components load on demand
- **Optimized Rendering** - Efficient re-renders
- **Responsive Images** - Optimized for different screen sizes

### Accessibility
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **Color Contrast** - WCAG compliant color schemes
- **Focus Management** - Proper focus indicators

## Troubleshooting

### Common Issues

1. **Sidebar Not Sticky**
   - Check if parent container has proper positioning
   - Verify CSS classes are applied correctly

2. **Navigation Not Working**
   - Ensure React Router is properly configured
   - Check route paths match exactly

3. **Styling Issues**
   - Verify Tailwind CSS is imported
   - Check component library dependencies

4. **TypeScript Errors**
   - Ensure all required props are provided
   - Check type definitions for components

### Debug Mode

Enable debug logging by setting:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
```

## Contributing

### Development Guidelines
1. **Component Structure** - Follow existing patterns
2. **Styling** - Use Tailwind CSS classes
3. **State Management** - Keep state local to components
4. **Testing** - Write tests for new features
5. **Documentation** - Update this file for changes

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Maintain consistent naming conventions
- Add proper error handling

## Conclusion

The Account Layout system provides a comprehensive, user-friendly interface for account management. With its intuitive navigation, responsive design, and feature-rich pages, it offers users complete control over their account settings, order tracking, and profile management.

The system is built with scalability in mind and can easily be extended with additional features and integrations as needed.
