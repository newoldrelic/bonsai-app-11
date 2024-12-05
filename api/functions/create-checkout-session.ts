import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { debug } from '../../src/utils/debug';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    debug.error('Missing STRIPE_SECRET_KEY environment variable');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Payment service is not properly configured' })
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { priceId, userEmail, giftEmail, returnUrl } = JSON.parse(event.body);

    debug.info('Creating checkout session:', { priceId, userEmail, giftEmail });

    if (!priceId || !userEmail || !returnUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          details: {
            priceId: !priceId,
            userEmail: !userEmail,
            returnUrl: !returnUrl
          }
        })
      };
    }

    // Verify the price ID exists in Stripe
    try {
      await stripe.prices.retrieve(priceId);
    } catch (error: any) {
      debug.error('Invalid price ID:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid price ID',
          details: error.message
        })
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        userEmail,
        giftEmail: giftEmail || ''
      }
    });

    if (!session.url) {
      throw new Error('Failed to generate checkout URL');
    }

    debug.info('Checkout session created successfully:', { sessionId: session.id });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error: any) {
    debug.error('Checkout session error:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      })
    };
  }
};