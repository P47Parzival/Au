import React from "react";
import { useSearchParams } from "react-router-dom";
import PayPalPayment from "../components/PayPalPayment";

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");

    const executePayment = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/execute-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payment_id: paymentId,
                    payer_id: payerId,
                }),
            });

            const data = await response.json();
            if (data.status === "success") {
                alert("Payment successful! ID: " + data.payment_id);
                // You can redirect to a success page or update UI here
            } else {
                alert("Payment failed: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Payment execution error:", error);
            alert("Payment execution failed. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">PayPal Payment Integration</h1>
            {!paymentId ? (
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
                        <PayPalPayment 
                            amount={10.00}
                            onSuccess={(paymentId) => {
                                console.log("Payment created:", paymentId);
                            }}
                            onError={(error) => {
                                console.error("Payment error:", error);
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
                        <p className="mb-4 text-gray-600">
                            Your payment has been initiated. Click the button below to complete the transaction.
                        </p>
                        <button
                            onClick={executePayment}
                            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Complete Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage; 