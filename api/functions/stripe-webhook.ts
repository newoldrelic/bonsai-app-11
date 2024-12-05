import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { debug } from '../../src/utils/debug';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeEvent {
  type: string;
  data: {
    object: any;
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405 };
  }

  const sig = event.headers['stripe-signature'];
  
  // Allow webhook testing in development without signature
  if (process.env.NODE_ENV === 'development') {
    debug.warn('Webhook signature check skipped in development mode');
  } else if (!sig || !endpointSecret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or webhook secret' })
    };
  }

  try {
    let stripeEvent: StripeEvent;
    
    if (process.env.NODE_ENV === 'development') {
      stripeEvent = JSON.parse(event.body || '');
    } else {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body || '',
        sig!,
        endpointSecret!
      );
    }

    debug.info('Processing webhook event:', stripeEvent.type);

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const { userEmail, giftEmail } = session.metadata;

        // Create or update subscription document
        await stripe.customers.update(session.customer, {
          metadata: {
            userEmail,
            giftEmail: giftEmail || ''
          }
        });

        debug.info('Subscription activated for:', userEmail);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if ('metadata' in customer) {
          const { userEmail } = customer.metadata;
          debug.info('Subscription updated for:', userEmail);
        }
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (err: any) {
    debug.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};