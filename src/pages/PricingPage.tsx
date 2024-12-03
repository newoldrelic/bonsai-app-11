import React from 'react';
import { Check, AlertCircle, Crown, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS } from '../config/stripe';
import { PRICING_CONFIG, HOBBY_FEATURES, PREMIUM_FEATURES } from '../config/pricing';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { CurrencySelector } from '../components/CurrencySelector';
import { useCurrencyStore, formatPrice } from '../utils/currency';

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getCurrentPlan, createCheckoutSession, loading, error, clearError } = useSubscriptionStore();
  const { current: currency } = useCurrencyStore();
  const currentPlan = getCurrentPlan();

  const handleSubscribe = async (stripePriceId: string) => {
    if (!stripePriceId) return;
    if (!user) {
      navigate('/', { state: { showAuth: true } });
      return;
    }
    await createCheckoutSession(stripePriceId);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-bonsai-bark dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-6">
            Select the perfect plan for your bonsai journey. Upgrade or downgrade anytime.
          </p>
          <CurrencySelector />
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-9">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-bonsai-green" />
              <span>Subscription Plans</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-bonsai-green/5 dark:bg-bonsai-green/10 p-8 rounded-2xl">
                          
              {/* Hobby Plan */}
              <div className={`card p-8 h-full relative bg-white dark:bg-stone-800 ${
                currentPlan.id === 'hobby' ? 'ring-4 ring-bonsai-green shadow-lg' : ''
              }`}>
                {currentPlan.id === 'hobby' && (
                  <div className="absolute -top-3 right-4 bg-bonsai-green text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
                    Hobby
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                      {formatPrice(0, currency)}
                    </span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {HOBBY_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                      <span className="text-stone-600 dark:text-stone-300 text-sm">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 px-4 rounded-lg font-medium bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 cursor-default"
                >
                  Free Plan
                </button>
              </div>

              {/* Premium Monthly */}
              <div className={`card p-8 h-full relative bg-white dark:bg-stone-800 ${
                currentPlan.id === 'premium-monthly' ? 'ring-4 ring-bonsai-green shadow-lg' : ''
              }`}>
                {currentPlan.id === 'premium-monthly' ? (
                  <div className="absolute -top-3 right-4 bg-bonsai-green text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                ) : (
                  <div className="absolute -top-3 left-4 bg-bonsai-green text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
                    Premium Monthly
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                      {formatPrice(PRICING_CONFIG.prices.monthly, currency)}
                    </span>
                    <span className="text-stone-600 dark:text-stone-300">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                      <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                        {feature.premium && <Crown className="w-5 h-5 text-bonsai-terra" />}
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(PRICING_TIERS.PREMIUM_MONTHLY)}
                  disabled={loading || currentPlan.id === 'premium-monthly'}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Subscribe Monthly'}
                </button>
              </div>

              {/* Premium Annual */}
              <div className={`card p-8 h-full relative bg-white dark:bg-stone-800 ${
                currentPlan.id === 'premium-annual' ? 'ring-4 ring-bonsai-green shadow-lg' : ''
              }`}>
                {currentPlan.id === 'premium-annual' ? (
                  <div className="absolute -top-3 right-4 bg-bonsai-green text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                ) : (
                  <div className="absolute -top-3 left-4 bg-bonsai-terra text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    Best Value
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-bonsai-bark dark:text-white mb-2">
                    Premium Annual
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-bonsai-bark dark:text-white">
                      {formatPrice(PRICING_CONFIG.prices.annual, currency)}
                    </span>
                    <span className="text-stone-600 dark:text-stone-300">/year</span>
                    <div className="text-sm text-bonsai-terra mt-1">
                      Save {PRICING_CONFIG.prices.annualDiscount}%
                    </div>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-0.5" />
                      <span className="text-stone-600 dark:text-stone-300 text-sm flex items-center gap-2">
                        {feature.premium && <Crown className="w-5 h-5 text-bonsai-terra" />}
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(PRICING_TIERS.PREMIUM_ANNUAL)}
                  disabled={loading || currentPlan.id === 'premium-annual'}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-bonsai-green text-white hover:bg-bonsai-moss transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Subscribe Annually'}
                </button>
              </div>
            </div>
          </div>

          {/* Gift Options */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-bonsai-terra" />
              <span>Holiday Special</span>
            </h2>
            <div className="space-y-4 bg-bonsai-terra/5 dark:bg-bonsai-terra/10 p-8 rounded-2xl">
              {PRICING_CONFIG.gifts.enabled && Object.entries(PRICING_CONFIG.gifts.options).map(([duration, option]) => (
                <div key={duration} className="card p-6 relative bg-white dark:bg-stone-800">
                  {duration === 'twelveMonths' && (
                    <div className="absolute -top-3 right-4 bg-bonsai-terra text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                      Best Value
                    </div>
                  )}
                  <div className="text-center">
                    <Gift className="w-8 h-8 text-bonsai-terra mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-bonsai-bark dark:text-white mb-1">
                      Premium Gift
                    </h3>
                    <div className="text-lg font-medium text-bonsai-terra mb-2">
                      {duration === 'oneMonth' ? '1 Month' :
                       duration === 'threeMonths' ? '3 Months' :
                       duration === 'sixMonths' ? '6 Months' :
                       '12 Months'}
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-bonsai-bark dark:text-white">
                        {formatPrice(option.price, currency)}
                      </span>
                      <div className="text-sm text-bonsai-terra line-through">
                        {formatPrice(option.originalPrice, currency)}
                      </div>
                      <div className="text-sm text-bonsai-terra">
                        Save {option.discount}%
                      </div>
                    </div>
                    <button
                      onClick={() => handleSubscribe(PRICING_TIERS[`GIFT_${duration === 'oneMonth' ? '1MONTH' : 
                                                                         duration === 'threeMonths' ? '3MONTHS' :
                                                                         duration === 'sixMonths' ? '6MONTHS' :
                                                                         '12MONTHS'}`])}
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-lg font-medium bg-bonsai-terra text-white hover:bg-bonsai-clay transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Gift Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>
            All plans include a 14-day money-back guarantee. Cancel anytime.
            <br />
            Questions? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}