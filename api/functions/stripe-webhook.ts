import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { debug } from '../../src/utils/debug';

const firebaseConfig = {
  apiKey: "AIzaSyDATJrKcVbQGPL-qaMzbG9ZJT1EeCDc9RQ",
  authDomain: "bonsai-c0690.firebaseapp.com",
  projectId: "bonsai-c0690",
  storageBucket: "bonsai-c0690.firebasestorage.app",
  messagingSenderId: "755508788438",
  appId: "1:755508788438:web:80947149c2649f1f385d77",
  measurementId: "G-MBVTEP2XRT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function updateSubscriptionInFirestore(userEmail: string, subscriptionData: any) {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userEmail);
    await setDoc(subscriptionRef, {
      id: subscriptionData.id,
      status: subscriptionData.status,
      planId: subscriptionData.items.data[0].price.id,
      currentPeriodEnd: subscriptionData.current_period_end,
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
      userEmail
    }, { merge: true });

    debug.info('Subscription updated in Firestore:', { userEmail, subscriptionId: subscriptionData.id });
  } catch (error) {
    debug.error('Error updating subscription in Firestore:', error);
    throw error;
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig || !endpointSecret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or webhook secret' })
    };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      endpointSecret
    );

    debug.info('Processing webhook event:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        
        if (!session.subscription) {
          // Handle one-time payments (gifts)
          return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
          };
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await updateSubscriptionInFirestore(session.customer_email!, subscription);

        return {
          statusCode: 200,
          body: JSON.stringify({
            received: true,
            subscriptionId: subscription.id
          })
        };
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (typeof customer !== 'string' && customer.email) {
          await updateSubscriptionInFirestore(customer.email, subscription);
        }

        return {
          statusCode: 200,
          body: JSON.stringify({
            received: true,
            subscriptionId: subscription.id
          })
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Unhandled event type ${stripeEvent.type}` })
        };
    }
  } catch (err: any) {
    debug.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};