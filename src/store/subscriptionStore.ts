import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../config/firebase';
import type { UserSubscription } from '../types';
import { createCheckoutSession } from '../services/stripeService';

interface SubscriptionState {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  checkoutSession: string | null;
  createCheckoutSession: (priceId: string, giftEmail?: string) => Promise<void>;
  getCurrentPlan: () => string;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      loading: false,
      error: null,
      checkoutSession: null,

      createCheckoutSession: async (priceId: string, giftEmail?: string) => {
        const user = auth.currentUser;
        if (!user?.email) {
          set({ error: 'Please sign in to subscribe' });
          return;
        }

        try {
          set({ loading: true, error: null });
          const checkoutUrl = await createCheckoutSession(priceId, user.email, giftEmail);
          window.location.href = checkoutUrl;
        } catch (error: any) {
          console.error('Error creating checkout session:', error);
          set({ 
            error: error.message || 'Failed to start checkout process',
            loading: false 
          });
        }
      },

      getCurrentPlan: () => {
        const { subscription } = get();
        // Only return premium if user is logged in and has an active subscription
        if (auth.currentUser && subscription?.status === 'active') {
          return subscription.planId;
        }
        return 'hobby';
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        subscription: state.subscription
      })
    }
  )
);