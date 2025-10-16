// Razorpay configuration and utility functions

// Razorpay test key
export const RAZORPAY_KEY_ID = 'rzp_test_nLQYAWuOKvzENb';

// Currency configuration
export const CURRENCY = 'INR';

// Function to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Function to create Razorpay payment options
export const createRazorpayOptions = (
  orderId: string,
  amount: number,
  name: string,
  email: string,
  contact: string,
  callback: (response: any) => void
) => {
  // Ensure amount is in paise (multiply by 100)
  const amountInPaise = Math.round(amount * 100);
  
  return {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise.toString(), // amount in smallest currency unit (paise)
    currency: CURRENCY,
    name: 'Clothing Website',
    description: `Order ID: ${orderId}`,
    order_id: orderId,
    handler: callback,
    prefill: {
      name,
      email,
      contact,
    },
    notes: {
      address: 'Clothing Website Corporate Office',
    },
    theme: {
      color: '#3399cc',
    },
  };
};

// Function to initialize Razorpay payment
export const initializeRazorpayPayment = async (
  orderId: string,
  amount: number,
  name: string,
  email: string,
  contact: string,
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onError: (error: any) => void
) => {
  // Load Razorpay script
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onError(new Error('Razorpay SDK failed to load'));
    return;
  }

  // Create options
  const options = createRazorpayOptions(
    orderId,
    amount,
    name,
    email,
    contact,
    (response) => {
      onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    }
  );

  // Initialize Razorpay
  try {
    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    onError(error);
  }
};