import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, ArrowRight, ChevronDown, ChevronUp, DollarSign, PieChart } from 'lucide-react';

type CalculatorType = 'brokerage' | 'sip' | 'lumpsum' | 'fd' | 'ppf' | 'tax';
type SegmentType = 'equity-delivery' | 'equity-intraday' | 'f&o' | 'currency' | 'commodity';

const BrokerageCalculator: React.FC = () => {
  // Main calculator selection
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('brokerage');
  
  // Brokerage calculator states
  const [activeSegment, setActiveSegment] = useState<SegmentType>('equity-delivery');
  const [quantity, setQuantity] = useState<number>(50);
  const [buyPrice, setBuyPrice] = useState<number>(1000);
  const [sellPrice, setSellPrice] = useState<number>(1500);
  const [showChargesBreakdown, setShowChargesBreakdown] = useState<boolean>(true);
  
  // SIP calculator states
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [sipDuration, setSipDuration] = useState<number>(5);
  
  // Lumpsum calculator states
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000);
  const [lumpsumReturn, setLumpsumReturn] = useState<number>(10);
  const [lumpsumDuration, setLumpsumDuration] = useState<number>(10);
  
  // Fixed deposit calculator states
  const [fdAmount, setFdAmount] = useState<number>(100000);
  const [fdRate, setFdRate] = useState<number>(6.5);
  const [fdDuration, setFdDuration] = useState<number>(3);
  const [fdCompounding, setFdCompounding] = useState<string>('quarterly');
  
  // PPF Calculator states
  const [ppfAmount, setPpfAmount] = useState<number>(500);
  const [ppfDuration, setPpfDuration] = useState<number>(15);
  const ppfInterestRate = 7.1; // Current PPF interest rate

  // Income Tax Calculator states
  const [annualIncome, setAnnualIncome] = useState<number>(500000);
  const [regime, setRegime] = useState<'old' | 'new'>('new');
  const [age, setAge] = useState<number>(30);
  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    hra: 0,
    standardDeduction: 50000,
  });

  // Calculation results
  const [turnover, setTurnover] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [totalCharges, setTotalCharges] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [chargesBreakdown, setChargesBreakdown] = useState({
    brokerage: 0,
    platformCharges: 0,
    stt: 0,
    exchange: 0,
    sebi: 0,
    gst: 0,
    stampDuty: 0
  });
  
  // SIP/Lumpsum results
  const [investedAmount, setInvestedAmount] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [maturityAmount, setMaturityAmount] = useState<number>(0);

  // Rates for different segments
  const rates = {
    'equity-delivery': {
      brokerage: 0, // Zero brokerage for delivery
      stt: 0.001, // 0.1% of transaction value
      exchangeCharge: 0.0000345, // 0.00345% of transaction value
      sebi: 0.000001, // 0.0001% of transaction value
      gst: 0.18, // 18% on brokerage and exchange charges
      stampDuty: 0.00006 // 0.006% of transaction value (varies by state)
    },
    'equity-intraday': {
      brokerage: 0.0003, // 0.03% or ₹20 per order, whichever is lower
      stt: 0.00025, // 0.025% of sell side transaction value
      exchangeCharge: 0.0000345, // 0.00345% of transaction value
      sebi: 0.000001, // 0.0001% of transaction value
      gst: 0.18, // 18% on brokerage and exchange charges
      stampDuty: 0.00002 // 0.002% of transaction value (varies by state)
    },
    'f&o': {
      brokerage: 20, // ₹20 per order
      stt: 0.0001, // 0.01% of sell side transaction value for futures
      exchangeCharge: 0.0002, // 0.02% of transaction value
      sebi: 0.000001, // 0.0001% of transaction value
      gst: 0.18, // 18% on brokerage and exchange charges
      stampDuty: 0.00002 // 0.002% of transaction value (varies by state)
    },
    'currency': {
      brokerage: 20, // ₹20 per order
      stt: 0, // No STT for currency
      exchangeCharge: 0.0001, // 0.01% of transaction value
      sebi: 0.000001, // 0.0001% of transaction value
      gst: 0.18, // 18% on brokerage and exchange charges
      stampDuty: 0.00001 // 0.001% of transaction value (varies by state)
    },
    'commodity': {
      brokerage: 20, // ₹20 per order
      stt: 0, // No STT for commodities
      exchangeCharge: 0.00026, // 0.026% of transaction value
      sebi: 0.000001, // 0.0001% of transaction value
      gst: 0.18, // 18% on brokerage and exchange charges
      stampDuty: 0.00002 // 0.002% of transaction value (varies by state)
    }
  };

  // Calculate brokerage charges
  useEffect(() => {
    if (activeCalculator !== 'brokerage') return;
    
    // Calculate turnover
    const buyValue = quantity * buyPrice;
    const sellValue = quantity * sellPrice;
    const calculatedTurnover = buyValue + sellValue;
    setTurnover(calculatedTurnover);

    // Calculate P&L
    const calculatedPL = sellValue - buyValue;
    setProfitLoss(calculatedPL);

    // Calculate charges based on segment
    const currentRates = rates[activeSegment];
    
    // Brokerage calculation
    let brokerage = 0;
    if (activeSegment === 'equity-delivery') {
      brokerage = 0; // Zero brokerage for delivery
    } else if (activeSegment === 'equity-intraday') {
      // 0.03% or ₹20 per order, whichever is lower (on both buy and sell)
      const buyBrokerage = Math.min(buyValue * currentRates.brokerage, 20);
      const sellBrokerage = Math.min(sellValue * currentRates.brokerage, 20);
      brokerage = buyBrokerage + sellBrokerage;
    } else {
      brokerage = 20 * 2; // ₹20 per order (buy and sell) for F&O, Currency, Commodity
    }

    // STT calculation
    let stt = 0;
    if (activeSegment === 'equity-delivery') {
      // STT on both buy and sell for delivery
      stt = (buyValue + sellValue) * currentRates.stt;
    } else if (activeSegment === 'currency' || activeSegment === 'commodity') {
      stt = 0; // No STT for currency and commodity
    } else {
      // STT only on sell side for intraday and F&O
      stt = sellValue * currentRates.stt;
    }

    // Exchange charges
    const exchangeCharges = calculatedTurnover * currentRates.exchangeCharge;
    
    // SEBI charges
    const sebiCharges = calculatedTurnover * currentRates.sebi;
    
    // GST on brokerage and exchange charges
    const gst = (brokerage + exchangeCharges) * currentRates.gst;
    
    // Stamp duty (only on buy side)
    const stampDuty = buyValue * currentRates.stampDuty;

    // Set charges breakdown
    const platformCharges = 0; // Can be fixed per trade or percentage
    const totalCalculatedCharges = brokerage + platformCharges + stt + exchangeCharges + sebiCharges + gst + stampDuty;
    
    setChargesBreakdown({
      brokerage,
      platformCharges,
      stt,
      exchange: exchangeCharges,
      sebi: sebiCharges,
      gst,
      stampDuty
    });

    // Calculate total charges and net amount
    setTotalCharges(totalCalculatedCharges);
    setNetAmount(profitLoss - totalCalculatedCharges);

  }, [quantity, buyPrice, sellPrice, activeSegment, activeCalculator, profitLoss]);

  // Calculate SIP returns
  useEffect(() => {
    if (activeCalculator !== 'sip') return;
    
    const monthsCount = sipDuration * 12;
    const monthlyRate = expectedReturn / 12 / 100;
    const total = monthlyInvestment * ((Math.pow(1 + monthlyRate, monthsCount) - 1) / monthlyRate) * (1 + monthlyRate);
    
    const invested = monthlyInvestment * monthsCount;
    setInvestedAmount(invested);
    setMaturityAmount(total);
    setEstimatedReturns(total - invested);
    
  }, [monthlyInvestment, expectedReturn, sipDuration, activeCalculator]);

  // Calculate Lumpsum returns
  useEffect(() => {
    if (activeCalculator !== 'lumpsum') return;
    
    const total = lumpsumAmount * Math.pow((1 + lumpsumReturn / 100), lumpsumDuration);
    
    setInvestedAmount(lumpsumAmount);
    setMaturityAmount(total);
    setEstimatedReturns(total - lumpsumAmount);
    
  }, [lumpsumAmount, lumpsumReturn, lumpsumDuration, activeCalculator]);

  // Calculate FD returns
  useEffect(() => {
    if (activeCalculator !== 'fd') return;
    
    let compoundingsPerYear = 1; // Annual
    
    switch (fdCompounding) {
      case 'monthly':
        compoundingsPerYear = 12;
        break;
      case 'quarterly':
        compoundingsPerYear = 4;
        break;
      case 'half-yearly':
        compoundingsPerYear = 2;
        break;
      default:
        compoundingsPerYear = 1;
    }
    
    const rate = fdRate / 100;
    const compoundRate = rate / compoundingsPerYear;
    const time = fdDuration * compoundingsPerYear;
    
    const total = fdAmount * Math.pow((1 + compoundRate), time);
    
    setInvestedAmount(fdAmount);
    setMaturityAmount(total);
    setEstimatedReturns(total - fdAmount);
    
  }, [fdAmount, fdRate, fdDuration, fdCompounding, activeCalculator]);

  // Calculate PPF returns
  useEffect(() => {
    if (activeCalculator !== 'ppf') return;
    
    const calculatePPF = () => {
      let totalAmount = 0;
      let totalInvestment = ppfAmount * 12 * ppfDuration;
      
      for (let year = 1; year <= ppfDuration; year++) {
        const yearlyDeposit = ppfAmount * 12;
        const interest = ((totalAmount + yearlyDeposit) * ppfInterestRate) / 100;
        totalAmount += yearlyDeposit + interest;
      }
      
      setInvestedAmount(totalInvestment);
      setMaturityAmount(totalAmount);
      setEstimatedReturns(totalAmount - totalInvestment);
    };
    
    calculatePPF();
  }, [ppfAmount, ppfDuration, activeCalculator]);

  // Calculate Income Tax
  useEffect(() => {
    if (activeCalculator !== 'tax') return;
    
    const calculateTax = () => {
      let taxableIncome = annualIncome;
      let tax = 0;
      
      // Subtract deductions
      if (regime === 'old') {
        taxableIncome -= (deductions.section80C + deductions.section80D + deductions.hra);
      }
      taxableIncome -= deductions.standardDeduction;
      
      if (regime === 'new') {
        // New Tax Regime Slabs (2024-25)
        if (taxableIncome <= 300000) {
          tax = 0;
        } else if (taxableIncome <= 600000) {
          tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
          tax = 15000 + (taxableIncome - 600000) * 0.1;
        } else if (taxableIncome <= 1200000) {
          tax = 45000 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
          tax = 90000 + (taxableIncome - 1200000) * 0.2;
        } else {
          tax = 150000 + (taxableIncome - 1500000) * 0.3;
        }
      } else {
        // Old Tax Regime Slabs
        if (taxableIncome <= 250000) {
          tax = 0;
        } else if (taxableIncome <= 500000) {
          tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
          tax = 12500 + (taxableIncome - 500000) * 0.2;
        } else {
          tax = 112500 + (taxableIncome - 1000000) * 0.3;
        }
      }
      
      // Add surcharge and cess
      const cess = tax * 0.04;
      tax += cess;
      
      setTotalCharges(tax);
      setNetAmount(annualIncome - tax);
    };
    
    calculateTax();
  }, [annualIncome, regime, deductions, activeCalculator]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.round(amount));
  };

  // Render different calculators based on activeCalculator state
  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'brokerage':
        return renderBrokerageCalculator();
      case 'sip':
        return renderSIPCalculator();
      case 'lumpsum':
        return renderLumpsumCalculator();
      case 'fd':
        return renderFDCalculator();
      case 'ppf':
        return renderPPFCalculator();
      case 'tax':
        return renderTaxCalculator();
      default:
        return renderBrokerageCalculator();
    }
  };

  // Brokerage Calculator UI
  const renderBrokerageCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">Brokerage Calculator</h2>
      
      {/* Segment selectors */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { id: 'equity-delivery', label: 'Equity - Delivery' },
          { id: 'equity-intraday', label: 'Equity - Intraday' },
          { id: 'f&o', label: 'F&O' },
          { id: 'currency', label: 'Currency' },
          { id: 'commodity', label: 'Commodity' }
        ].map((segment) => (
          <button
            key={segment.id}
            className={`px-4 py-2 rounded-lg text-sm 
              ${activeSegment === segment.id 
                ? 'bg-accent text-white'  // Changed to white text
                : 'bg-primary-light hover:bg-primary-light/70 text-adaptive'}`}  // Added text-adaptive
            onClick={() => setActiveSegment(segment.id as SegmentType)}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {/* Input fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Buy Price
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Math.max(0.01, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Sell Price
          </label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(Math.max(0.01, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Turnover</p>
              <p className="text-xl font-bold text-adaptive">{formatCurrency(turnover)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">P&L</p>
              <p className={`text-xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profitLoss)}
              </p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Total Charges</p>
              <p className="text-xl font-bold text-yellow-400">{formatCurrency(totalCharges)}</p>
            </div>
          </div>

          <div className="p-4 bg-primary-light rounded-lg mb-6">
            <div className="flex justify-between items-center cursor-pointer text-adaptive" 
                onClick={() => setShowChargesBreakdown(!showChargesBreakdown)}>
              <h3 className="font-semibold text-adaptive">Charges Breakdown</h3>
              {showChargesBreakdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {showChargesBreakdown && (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">Brokerage</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.brokerage)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">STT</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.stt)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">Exchange Transaction Charges</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.exchange)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">SEBI Charges</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.sebi)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">GST (18%)</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.gst)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-adaptive">Stamp Duty</span>
                  <span className="text-adaptive">{formatCurrency(chargesBreakdown.stampDuty)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-accent text-primary rounded-lg">
            <div className="flex justify-between items-center font-bold">
              <span>Net P&L (after charges)</span>
              <span>{formatCurrency(profitLoss - totalCharges)}</span>
            </div>
            <div className="text-xs mt-1 text-primary/80">
              {totalCharges > 0 && (
                <span>Effective cost: {((totalCharges / turnover) * 100).toFixed(3)}% of turnover</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // SIP Calculator UI
  const renderSIPCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">SIP Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Monthly Investment Amount (₹)
          </label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Math.max(1, Math.min(30, Number(e.target.value))))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Investment Period (Years)
          </label>
          <input
            type="number"
            value={sipDuration}
            onChange={(e) => setSipDuration(Math.max(1, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={sipDuration}
            onChange={(e) => setSipDuration(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Invested Amount</p>
              <p className="text-xl text-black font-bold">{formatCurrency(investedAmount)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Est. Returns</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(estimatedReturns)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Total Value</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Lumpsum Calculator UI
  const renderLumpsumCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">Lumpsum Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Investment Amount (₹)
          </label>
          <input
            type="number"
            value={lumpsumAmount}
            onChange={(e) => setLumpsumAmount(Math.max(1000, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={lumpsumReturn}
            onChange={(e) => setLumpsumReturn(Math.max(1, Math.min(30, Number(e.target.value))))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={lumpsumReturn}
            onChange={(e) => setLumpsumReturn(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Investment Period (Years)
          </label>
          <input
            type="number"
            value={lumpsumDuration}
            onChange={(e) => setLumpsumDuration(Math.max(1, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={lumpsumDuration}
            onChange={(e) => setLumpsumDuration(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Invested Amount</p>
              <p className="text-xl text-black font-bold">{formatCurrency(investedAmount)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Est. Returns</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(estimatedReturns)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Total Value</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fixed Deposit Calculator UI
  const renderFDCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">Fixed Deposit Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Deposit Amount (₹)
          </label>
          <input
            type="number"
            value={fdAmount}
            onChange={(e) => setFdAmount(Math.max(1000, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={fdRate}
            onChange={(e) => setFdRate(Math.max(1, Math.min(15, Number(e.target.value))))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <input
            type="range"
            min="1"
            max="15"
            step="0.1"
            value={fdRate}
            onChange={(e) => setFdRate(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tenure (Years)
          </label>
          <input
            type="number"
            value={fdDuration}
            onChange={(e) => setFdDuration(Math.max(0.25, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Interest Compounding
          </label>
          <select
            value={fdCompounding}
            onChange={(e) => setFdCompounding(e.target.value)}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          >
            <option value="annually">Annually</option>
            <option value="half-yearly">Half Yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Principal Amount</p>
              <p className="text-xl text-black font-bold">{formatCurrency(investedAmount)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Interest Earned</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(estimatedReturns)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-gray-400">Maturity Amount</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // PPF Calculator UI
  const renderPPFCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">PPF Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Monthly Investment (₹)
          </label>
          <input
            type="number"
            value={ppfAmount}
            onChange={(e) => setPpfAmount(Math.max(500, Math.min(150000/12, Number(e.target.value))))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <p className="text-xs text-adaptive-secondary mt-1">Min: ₹500/month, Max: ₹12,500/month</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Investment Period (Years)
          </label>
          <input
            type="number"
            value={ppfDuration}
            onChange={(e) => setPpfDuration(Math.max(15, Math.min(50, Number(e.target.value))))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
          <p className="text-xs text-adaptive-secondary mt-1">Min: 15 years, can be extended in blocks of 5 years</p>
        </div>

        <div className="p-4 bg-primary-light rounded-lg">
          <p className="text-adaptive-secondary">Current Interest Rate</p>
          <p className="text-xl font-bold text-accent">{ppfInterestRate}% p.a.</p>
          <p className="text-xs text-adaptive-secondary mt-1">Compounded Annually</p>
        </div>

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Total Investment</p>
              <p className="text-xl font-bold text-adaptive">{formatCurrency(investedAmount)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Interest Earned</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(estimatedReturns)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Maturity Amount</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(maturityAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tax Calculator UI
  const renderTaxCalculator = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6 text-adaptive">Income Tax Calculator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Annual Income (₹)
          </label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
            className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tax Regime
          </label>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                regime === 'new' ? 'bg-accent text-white' : 'bg-primary-light text-adaptive'
              }`}
              onClick={() => setRegime('new')}
            >
              New Regime
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                regime === 'old' ? 'bg-accent text-white' : 'bg-primary-light text-adaptive'
              }`}
              onClick={() => setRegime('old')}
            >
              Old Regime
            </button>
          </div>
        </div>

        {regime === 'old' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Section 80C Deductions
              </label>
              <input
                type="number"
                value={deductions.section80C}
                onChange={(e) => setDeductions({...deductions, section80C: Math.min(150000, Number(e.target.value))})}
                className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Section 80D (Health Insurance)
              </label>
              <input
                type="number"
                value={deductions.section80D}
                onChange={(e) => setDeductions({...deductions, section80D: Number(e.target.value)})}
                className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                HRA Exemption
              </label>
              <input
                type="number"
                value={deductions.hra}
                onChange={(e) => setDeductions({...deductions, hra: Number(e.target.value)})}
                className="w-full bg-primary-light bg-opacity-50 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Gross Income</p>
              <p className="text-xl font-bold text-adaptive">{formatCurrency(annualIncome)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Tax Amount</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(totalCharges)}</p>
            </div>
            
            <div className="p-4 bg-primary-light rounded-lg">
              <p className="text-adaptive-secondary">Net Income</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(netAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pb-6 w-[80%] absolute right-6" // Add proper positioning
    >
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="w-8 h-8 text-accent" />
        <h1 className="text-3xl font-bold text-adaptive">Financial Calculators</h1>
      </div>
      
      {/* Rest of the calculator content */}
      <div className="flex flex-wrap gap-4 mb-6 overflow-x-auto">
        {[
          { id: 'brokerage', label: 'Brokerage', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'sip', label: 'SIP', icon: <ArrowRight className="w-4 h-4" /> },
          { id: 'lumpsum', label: 'Lumpsum', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'fd', label: 'Fixed Deposit', icon: <PieChart className="w-4 h-4" /> },
          { id: 'ppf', label: 'PPF', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'tax', label: 'Income Tax', icon: <DollarSign className="w-4 h-4" /> },
        ].map((calc) => (
          <button
            key={calc.id}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap
              ${activeCalculator === calc.id 
                ? 'bg-accent text-white'  // Changed to white text for better contrast
                : 'bg-primary-light hover:bg-primary-light/70 text-adaptive'}`}  // Added text-adaptive
            onClick={() => setActiveCalculator(calc.id as CalculatorType)}
          >
            {calc.icon}
            {calc.label}
          </button>
        ))}
      </div>

      {/* Active calculator */}
      {renderCalculator()}

      {/* Educational section */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-adaptive">About Financial Calculations</h2>
        <p className="text-adaptive-secondary mb-4">
          These calculators help you plan your investments and understand the costs involved in trading. Make informed decisions by comparing different investment options and their potential returns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary-light rounded-lg">
            <h3 className="font-medium mb-2 text-adaptive">Brokerage Calculator</h3>
            <p className="text-sm text-adaptive-secondary">Helps estimate the actual cost of your trades including all regulatory charges and taxes.</p>
          </div>
          <div className="p-4 bg-primary-light rounded-lg">
            <h3 className="font-medium mb-2 text-adaptive">SIP Calculator</h3>
            <p className="text-sm text-adaptive-secondary">Calculates how your monthly investments can grow over time with the power of compounding.</p>
          </div>
          <div className="p-4 bg-primary-light rounded-lg">
            <h3 className="font-medium mb-2 text-adaptive">Lumpsum Calculator</h3>
            <p className="text-sm text-adaptive-secondary">Estimates the future value of a one-time investment based on expected returns.</p>
          </div>
          <div className="p-4 bg-primary-light rounded-lg">
            <h3 className="font-medium mb-2 text-adaptive">Fixed Deposit Calculator</h3>
            <p className="text-sm text-adaptive-secondary">Calculates the maturity amount for your fixed deposit based on interest rate and compounding frequency.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export { BrokerageCalculator };