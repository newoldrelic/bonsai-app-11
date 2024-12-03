import { loadStripe } from '@stripe/stripe-js';
import { PRICING_CONFIG, HOBBY_FEATURES, PREMIUM_FEATURES, PRICING_TIERS } from './pricing';

// Only load Stripe in browser environment and with public key
export const stripePromise = typeof window !== 'undefined' 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
  : null;

// Pricing configuration
export const PRICING_PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: 0,
    interval: 'month',
    stripePriceId: PRICING_TIERS.HOBBY,
    features: HOBBY_FEATURES
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: PRICING_CONFIG.prices.monthly,
    interval: 'month',
    stripePriceId: PRICING_TIERS.PREMIUM_MONTHLY,
    features: PREMIUM_FEATURES,
    recommended: true
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: PRICING_CONFIG.prices.annual,
    interval: 'year',
    stripePriceId: PRICING_TIERS.PREMIUM_ANNUAL,
    features: PREMIUM_FEATURES,
    annualDiscount: PRICING_CONFIG.prices.annualDiscount
  },
  {
    id: 'gift-1month',
    name: 'Gift (1 Month)',
    price: PRICING_CONFIG.gifts.options.oneMonth.price,
    interval: 'one-time',
    stripePriceId: PRICING_TIERS.GIFT_1MONTH,
    features: PREMIUM_FEATURES
  },
  {
    id: 'gift-3months',
    name: 'Gift (3 Months)',
    price: PRICING_CONFIG.gifts.options.threeMonths.price,
    interval: 'one-time',
    stripePriceId: PRICING_TIERS.GIFT_3MONTHS,
    features: PREMIUM_FEATURES
  },
  {
    id: 'gift-6months',
    name: 'Gift (6 Months)',
    price: PRICING_CONFIG.gifts.options.sixMonths.price,
    interval: 'one-time',
    stripePriceId: PRICING_TIERS.GIFT_6MONTHS,
    features: PREMIUM_FEATURES
  }
] as const;