import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { debug } from '../../src/utils/debug';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Update subscription status in your database
        debug.info('Subscription activated:', {
          userEmail: session.customer_email,
          subscriptionId: subscription.id,
          status: subscription.status
        });

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
        
        debug.info('Subscription status changed:', {
          subscriptionId: subscription.id,
          status: subscription.status
        });

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