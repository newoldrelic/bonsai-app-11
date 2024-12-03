import { PRICING_PLANS } from '../config/stripe';

export async function createCheckoutSession(priceId: string, userEmail: string) {
  const response = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userEmail,
      returnUrl: window.location.origin
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  return data.url;
}

export function getPlanDetails(planId: string) {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}