# Stripe Payment Integration Setup

This guide explains how to set up Stripe payments in your Pick Bazar project.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Node.js and npm installed
3. PostgreSQL database running

## Installation

The required packages have already been installed:

```bash
npm install stripe @types/stripe @stripe/stripe-js @stripe/react-stripe-js
```

## Environment Configuration

1. Copy the environment variables from `src/server/env.example` to your `.env` file
2. Update the Stripe configuration with your actual keys:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
```

## Getting Stripe Keys

### 1. Secret Key
- Log into your Stripe Dashboard
- Go to Developers → API Keys
- Copy the "Secret key" (starts with `sk_test_` for test mode)

### 2. Publishable Key
- In the same API Keys section
- Copy the "Publishable key" (starts with `pk_test_` for test mode)

### 3. Webhook Secret
- Go to Developers → Webhooks
- Click "Add endpoint"
- Set endpoint URL to: `https://yourdomain.com/api/payments/webhook`
- Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`, `charge.refunded`
- Copy the webhook signing secret (starts with `whsec_`)

## Database Setup

The Prisma schema has been updated to include Stripe-specific fields:

1. **Payment Model**: Added `stripePaymentIntentId` and `metadata` fields
2. **Refund Model**: New model for handling refunds
3. **Order Model**: Added `paidAt` field

Run the database migration:

```bash
npx prisma db push
npx prisma generate
```

## API Endpoints

The following payment endpoints are now available:

### 1. Create Payment Intent
```
POST /api/payments/create-intent
```
Creates a Stripe payment intent for an order.

**Request Body:**
```json
{
  "orderId": "order_id_here",
  "amount": 1000.00,
  "currency": "ngn"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "paymentId": "payment_id_here"
}
```

### 2. Confirm Payment
```
POST /api/payments/confirm
```
Confirms a payment after successful Stripe processing.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

### 3. Get Payment Status
```
GET /api/payments/:paymentId
```
Retrieves payment information and status.

### 4. Process Refund
```
POST /api/payments/:paymentId/refund
```
Processes a refund for a completed payment.

**Request Body:**
```json
{
  "amount": 500.00,
  "reason": "Customer request"
}
```

### 5. Webhook Handler
```
POST /api/payments/webhook
```
Handles Stripe webhook events (no authentication required).

## Frontend Integration

### 1. Payment Form Component
Use the `PaymentWrapper` component to wrap your payment forms:

```tsx
import { PaymentWrapper } from '@/components/payment/PaymentWrapper';

<PaymentWrapper
  orderId="order_123"
  amount={1000.00}
  currency="ngn"
  onSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
  onError={(error) => console.error('Payment failed:', error)}
  onCancel={() => console.log('Payment cancelled')}
/>
```

### 2. Environment Variables
Add the Stripe publishable key to your frontend environment:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## Testing

### 1. Test Cards
Use these test card numbers for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### 2. Test Mode
- All Stripe operations run in test mode by default
- No real charges will be made
- Use test keys for development

## Production Deployment

### 1. Switch to Live Keys
- Replace test keys with live keys in production
- Update webhook endpoints to production URLs
- Ensure HTTPS is enabled

### 2. Security Considerations
- Never expose secret keys in frontend code
- Use environment variables for all sensitive data
- Implement proper error handling and logging
- Monitor webhook events for failed deliveries

## Troubleshooting

### Common Issues

1. **"Stripe secret key not set"**
   - Check your `.env` file has `STRIPE_SECRET_KEY`
   - Restart your server after adding environment variables

2. **"Invalid signature" in webhooks**
   - Verify webhook secret is correct
   - Check webhook endpoint URL is accessible
   - Ensure HTTPS is used in production

3. **Payment intent creation fails**
   - Verify order exists and is in PENDING status
   - Check amount is valid (positive number)
   - Ensure user is authenticated

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For project-specific issues:
- Check the server logs for detailed error messages
- Verify database schema matches Prisma models
- Ensure all environment variables are set correctly
