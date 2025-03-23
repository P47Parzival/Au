import React, { useState } from "react";

interface PayPalPaymentProps {
    amount: number;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: any) => void;
}

const PayPalPayment = ({ amount, onSuccess, onError }: PayPalPaymentProps) => {
    const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const createOrder = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("http://localhost:5000/api/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: "USD",
                }),
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setApprovalUrl(data.approval_url);
            onSuccess?.(data.payment_id);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            {approvalUrl ? (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Test Account Details:</h3>
                        <p className="text-sm text-blue-700">Email: sb-47qy4g2011234@personal.example.com</p>
                        <p className="text-sm text-blue-700">Password: test1234</p>
                    </div>
                    <a 
                        href={approvalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full"
                    >
                        <button 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                            disabled={isLoading}
                        >
                            Complete Payment on PayPal
                        </button>
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Test Mode</h3>
                        <p className="text-sm text-gray-600">
                            This is a test payment. You'll be redirected to PayPal's sandbox environment.
                        </p>
                    </div>
                    <button
                        onClick={createOrder}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Pay with PayPal'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PayPalPayment; 