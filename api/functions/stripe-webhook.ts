// Previous imports remain the same

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
    let stripeEvent;
    
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

    // Rest of the webhook handler code remains the same
  } catch (err: any) {
    debug.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};