'use client';

import React, { useState } from 'react';
import { initializeRazorpayPayment } from '../utils/razorpay';
import { authFetch } from '../utils/staticAuth';

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: (paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => void;
  onError: (error: any) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  customerInfo,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create order on the server
      const response = await authFetch('http://localhost:5000/api/payment/create-razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      
      // Initialize Razorpay payment
      initializeRazorpayPayment(
        orderData.id,
        amount,
        customerInfo.name,
        customerInfo.email,
        customerInfo.phone,
        (paymentId, orderId, signature) => {
          setIsProcessing(false);
          onSuccess({
            paymentId,
            orderId,
            signature,
          });
        },
        (error) => {
          setIsProcessing(false);
          onError(error);
        }
      );
    } catch (error) {
      setIsProcessing(false);
      onError(error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isProcessing ? 'Processing...' : 'Pay Now with Razorpay'}
      </button>
    </div>
  );
};

export default RazorpayPayment;