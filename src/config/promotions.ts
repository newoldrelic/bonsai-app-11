import { debug } from '../utils/debug';

export interface PromotionCode {
  code: string;
  discount: number; // Percentage (0-100)
  validUntil?: Date;
  maxUses?: number;
  currentUses?: number;
  description: string;
  applicablePlans: string[]; // Array of plan IDs
}

// Test promotion code (100% discount)
export const PROMOTION_CODES: Record<string, PromotionCode> = {
  'TEST100': {
    code: 'TEST100',
    discount: 100,
    description: 'Test promotion code - 100% off',
    applicablePlans: ['premium-monthly', 'premium-annual'],
    maxUses: 100
  }
};

export function validatePromotionCode(code: string): PromotionCode | null {
  const promotion = PROMOTION_CODES[code.toUpperCase()];
  
  if (!promotion) {
    debug.info('Invalid promotion code:', code);
    return null;
  }

  if (promotion.validUntil && new Date() > promotion.validUntil) {
    debug.info('Expired promotion code:', code);
    return null;
  }

  if (promotion.maxUses && promotion.currentUses && promotion.currentUses >= promotion.maxUses) {
    debug.info('Promotion code usage limit reached:', code);
    return null;
  }

  return promotion;
}