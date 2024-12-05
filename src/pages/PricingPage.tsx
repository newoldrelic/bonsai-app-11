{/* Previous imports remain the same */}

export function PricingPage() {
  // Previous code remains the same until the return statement

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-12">
      <div className="container mx-auto px-4">
        {/* Previous code remains the same */}

        {/* Add test mode notice */}
        {process.env.NODE_ENV === 'development' && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Test Mode</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
              Use these test card numbers to simulate different scenarios:
            </p>
            <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <li>Success: 4242 4242 4242 4242</li>
              <li>Requires Authentication: 4000 0025 0000 3155</li>
              <li>Payment Failed: 4000 0000 0000 0002</li>
              <li>Use any future date for expiry and any 3 digits for CVC</li>
            </ul>
          </div>
        )}

        {/* Rest of the code remains the same */}
      </div>
    </div>
  );
}