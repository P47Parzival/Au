import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Check } from "lucide-react";
import PayPalPayment from "../components/PayPalPayment";

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    description: string;
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 0,
        description: 'Essential features for getting started',
        features: [
            'Basic Portfolio Management',
            'Market Data Access',
            'Simple Analytics',
            'Email Support'
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 499,
        description: 'Advanced features for serious investors',
        features: [
            'All Basic Features',
            'Advanced Analytics',
            'Real-time Market Data',
            'Priority Support',
            'Custom Alerts',
            'Portfolio Optimization'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 999,
        description: 'Professional suite for active traders',
        features: [
            'All Premium Features',
            'AI Trading Signals',
            'Advanced Technical Analysis',
            'Dedicated Support',
            'API Access',
            'Custom Reports',
            'Tax Reports'
        ]
    }
];

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
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
            className="fade-in p-6"
        >
            <div className="flex items-center gap-3 mb-8">
                <CreditCard className="w-8 h-8 text-accent" />
                <h1 className="text-3xl font-bold text-adaptive">Choose Your Plan</h1>
            </div>

            {!paymentId ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {pricingPlans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`glass-card p-6 relative ${
                                plan.id === 'premium' ? 'border-2 border-accent' : ''
                            }`}
                        >
                            {plan.id === 'premium' && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-adaptive mb-2">{plan.name}</h2>
                            <p className="text-adaptive-secondary mb-4">{plan.description}</p>
                            <div className="text-3xl font-bold text-accent mb-6">
                                ₹{plan.price}
                                <span className="text-sm text-adaptive-secondary font-normal">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-adaptive-secondary">
                                        <Check className="w-5 h-5 text-accent mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            {plan.price === 0 ? (
                                <button
                                    onClick={() => alert("Basic plan activated!")}
                                    className="w-full bg-primary-light hover:bg-primary-light/70 text-adaptive px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Get Started
                                </button>
                            ) : (
                                <PayPalPayment
                                    amount={plan.price}
                                    onSuccess={(paymentId) => {
                                        console.log(`Payment created for ${plan.name}:`, paymentId);
                                        setSelectedPlan(plan.id);
                                    }}
                                    onError={(error) => {
                                        console.error(`Payment error for ${plan.name}:`, error);
                                    }}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="max-w-md mx-auto glass-card p-6">
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
        </motion.div>
    );
};

export default PaymentPage;