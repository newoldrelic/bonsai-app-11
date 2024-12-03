import { Leaf, TreeDeciduous, Bell, Camera, Gift, CreditCard, Bot, Stethoscope, Crown } from 'lucide-react';
import type { IconType } from 'lucide-react';

export interface Feature {
  text: string;
  icon: IconType;
  premium?: boolean;
}

export interface PricingConfig {
  enabled: boolean;
  prices: {
    monthly: number;
    annual: number;
    annualDiscount: number;
  };
  gifts: {
    enabled: boolean;
    options: {
      oneMonth: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      threeMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      sixMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
      twelveMonths: {
        price: number;
        originalPrice: number;
        discount: number;
      };
    };
  };
}

export const PRICING_TIERS = {
  HOBBY: 'price_hobby',
  PREMIUM_MONTHLY: 'price_premium_monthly',
  PREMIUM_ANNUAL: 'price_premium_annual',
  GIFT_1MONTH: 'price_gift_1month',
  GIFT_3MONTHS: 'price_gift_3months',
  GIFT_6MONTHS: 'price_gift_6months',
  GIFT_12MONTHS: 'price_gift_12months'
} as const;

export const PRICING_CONFIG: PricingConfig = {
  enabled: true,
  prices: {
    monthly: 5.99,
    annual: 59.99,
    annualDiscount: 20
  },
  gifts: {
    enabled: true,
    options: {
      oneMonth: {
        price: 9.99,
        originalPrice: 14.99,
        discount: 33
      },
      threeMonths: {
        price: 24.99,
        originalPrice: 39.99,
        discount: 38
      },
      sixMonths: {
        price: 44.99,
        originalPrice: 74.99,
        discount: 40
      },
      twelveMonths: {
        price: 79.99,
        originalPrice: 139.99,
        discount: 43
      }
    }
  }
};

export const HOBBY_FEATURES: Feature[] = [
  { text: 'Store up to 3 bonsai trees', icon: TreeDeciduous },
  { text: '3 free species identifications', icon: Camera },
  { text: 'Style guide access', icon: TreeDeciduous },
  { text: 'Basic maintenance tracking', icon: Bell },
  { text: 'Care reminders', icon: Bell }
];

export const PREMIUM_FEATURES: Feature[] = [
  { text: 'Everything in Hobby, plus:', icon: Crown },
  { text: 'Store unlimited bonsai trees', icon: TreeDeciduous, premium: true },
  { text: 'Unlimited species identification', icon: Camera, premium: true },
  { text: 'Advanced health diagnosis', icon: Camera, premium: true },
  { text: 'Expert coaching access', icon: Stethoscope, premium: true },
  { text: 'Priority support', icon: Bot, premium: true }
];