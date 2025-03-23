import React from 'react';
import { motion } from 'framer-motion';
import { Book, Shield, Users, AlertTriangle, ExternalLink } from 'lucide-react';

const SEBIrules = () => {
  const rules = [
    {
      title: "Investor Protection",
      icon: <Shield className="w-6 h-6 text-accent" />,
      description: "SEBI ensures protection of investor interests and promotes investor education and awareness.",
      key_points: [
        "Mandatory disclosure of material information by companies",
        "Grievance redressal mechanism for investors",
        "Strict action against unfair market practices"
      ]
    },
    {
      title: "Market Regulation",
      icon: <Book className="w-6 h-6 text-accent" />,
      description: "Regulations to maintain market integrity and ensure fair trading practices.",
      key_points: [
        "Prevention of insider trading",
        "Regulation of substantial acquisition of shares",
        "Registration and regulation of market intermediaries"
      ]
    },
    {
      title: "Trading Rules",
      icon: <Users className="w-6 h-6 text-accent" />,
      description: "Guidelines for trading activities and market participants.",
      key_points: [
        "T+1 settlement cycle for equity shares",
        "Circuit breakers and price bands",
        "Know Your Customer (KYC) requirements"
      ]
    },
    {
      title: "Compliance Requirements",
      icon: <AlertTriangle className="w-6 h-6 text-accent" />,
      description: "Mandatory compliance requirements for market participants.",
      key_points: [
        "Regular filing of returns and reports",
        "Maintenance of proper records",
        "Adherence to prescribed capital adequacy norms"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fade-in pb-6 w-[80%] absolute right-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <Book className="w-8 h-8 text-accent" />
        <h1 className="page-title text-adaptive">SEBI Rules and Regulations</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-primary-light mr-4">
                {rule.icon}
              </div>
              <h2 className="text-xl font-semibold text-adaptive">{rule.title}</h2>
            </div>
            <p className="text-adaptive-secondary mb-4">{rule.description}</p>
            <ul className="space-y-3">
              {rule.key_points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                  <span className="text-adaptive-secondary text-sm flex-1">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-accent mr-3" />
          <h3 className="text-xl font-semibold text-adaptive">Important Notice</h3>
        </div>
        <p className="text-adaptive-secondary mb-4">
          These are general guidelines provided for informational purposes. For detailed and up-to-date
          regulations, please refer to the official SEBI website or consult with a financial advisor.
        </p>
        <a
          href="https://www.sebi.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors text-sm mt-4"
        >
          Visit SEBI Official Website <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    </motion.div>
  );
};

export default SEBIrules;