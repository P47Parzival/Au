import React from 'react';
import { motion } from 'framer-motion';
import { Book, Shield, Users, AlertTriangle } from 'lucide-react';

const SEBIrules = () => {
  const rules = [
    {
      title: "Investor Protection",
      icon: <Shield className="w-6 h-6" />,
      description: "SEBI ensures protection of investor interests and promotes investor education and awareness.",
      key_points: [
        "Mandatory disclosure of material information by companies",
        "Grievance redressal mechanism for investors",
        "Strict action against unfair market practices"
      ]
    },
    {
      title: "Market Regulation",
      icon: <Book className="w-6 h-6" />,
      description: "Regulations to maintain market integrity and ensure fair trading practices.",
      key_points: [
        "Prevention of insider trading",
        "Regulation of substantial acquisition of shares",
        "Registration and regulation of market intermediaries"
      ]
    },
    {
      title: "Trading Rules",
      icon: <Users className="w-6 h-6" />,
      description: "Guidelines for trading activities and market participants.",
      key_points: [
        "T+1 settlement cycle for equity shares",
        "Circuit breakers and price bands",
        "Know Your Customer (KYC) requirements"
      ]
    },
    {
      title: "Compliance Requirements",
      icon: <AlertTriangle className="w-6 h-6" />,
      description: "Mandatory compliance requirements for market participants.",
      key_points: [
        "Regular filing of returns and reports",
        "Maintenance of proper records",
        "Adherence to prescribed capital adequacy norms"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-primary">SEBI Rules and Regulations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="text-primary mr-3">
                  {rule.icon}
                </div>
                <h2 className="text-xl font-semibold">{rule.title}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{rule.description}</p>
              <ul className="list-disc list-inside space-y-2">
                {rule.key_points.map((point, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-card rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Important Note</h3>
          <p className="text-muted-foreground">
            These are general guidelines provided for informational purposes. For detailed and up-to-date 
            regulations, please refer to the official SEBI website or consult with a financial advisor.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SEBIrules;