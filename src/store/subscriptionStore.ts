import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  setSubscription: (subscription: UserSubscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscription: null,
      loading: false,
      error: null,
      checkoutSession: null,

      setSubscription: (subscription) => set({ subscription }),

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
        const user = auth.currentUser;
        
        if (!user) {
          return 'hobby';
        }

        if (subscription?.status === 'active') {
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

// Set up subscription listener
auth.onAuthStateChanged(async (user) => {
  if (user?.email) {
    // Check subscription in Firestore
    const subscriptionRef = doc(db, 'subscriptions', user.email);
    
    // Set up real-time listener
    onSnapshot(subscriptionRef, (doc) => {
      if (doc.exists()) {
        const subscription = doc.data() as UserSubscription;
        useSubscriptionStore.getState().setSubscription(subscription);
      } else {
        useSubscriptionStore.getState().setSubscription(null);
      }
    });
  } else {
    useSubscriptionStore.getState().setSubscription(null);
  }
});