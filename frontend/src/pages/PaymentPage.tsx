import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fade-in"
        >
            <div className="flex items-center gap-3 mb-8">
                <CreditCard className="w-8 h-8 text-accent" />
                <h1 className="text-3xl font-bold text-adaptive">Payments</h1>
            </div>

            <div className="glass-card p-6">
                {!paymentId ? (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-adaptive">Make a Payment</h2>
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
                ) : (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-adaptive">Complete Your Payment</h2>
                        <p className="mb-4 text-adaptive-secondary">
                            Your payment has been initiated. Click the button below to complete the transaction.
                        </p>
                        <button
                            onClick={executePayment}
                            className="w-full bg-accent hover:bg-accent-hover text-primary px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Complete Payment
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PaymentPage;