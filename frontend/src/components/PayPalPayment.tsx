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
            
            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            setApprovalUrl(data.approval_url);
            onSuccess?.(data.payment_id);
        } catch (err: any) {
            console.error("PayPal payment error:", err);
            const errorMessage = err.message || 'An error occurred connecting to PayPal';
            setError(errorMessage);
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="text-red-400 bg-red-400/10 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-1">Payment Error</p>
                <p>{error}</p>
                <button 
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-accent hover:underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {approvalUrl ? (
                <div className="space-y-4">
                    {/* <div className="glass-card p-4">
                        <h3 className="font-semibold text-adaptive mb-2">Test Account Details:</h3>
                        <p className="text-sm text-adaptive-secondary">Email: sb-47qy4g2011234@personal.example.com</p>
                        <p className="text-sm text-adaptive-secondary">Password: test1234</p>
                    </div> */}
                    <a 
                        href={approvalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full"
                    >
                        <button 
                            className="w-full bg-accent hover:bg-accent-hover text-primary px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Complete Payment on PayPal
                        </button>
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-adaptive mb-2">Test Mode</h3>
                        <p className="text-sm text-adaptive-secondary">
                            This is a test payment. You'll be redirected to PayPal's sandbox environment.
                        </p>
                    </div>
                    <button
                        onClick={createOrder}
                        className="w-full bg-accent hover:bg-accent-hover text-primary px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
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