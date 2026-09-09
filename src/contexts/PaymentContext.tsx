import React, { createContext, useContext, useState } from 'react';

export interface PaymentSplit {
  owner: {
    percentage: number;
    amount: {
      usd: number;
      ngn: number;
    };
  };
  agent?: {
    percentage: number;
    amount: {
      usd: number;
      ngn: number;
    };
  };
  serviceFee: {
    percentage: number;
    amount: {
      usd: number;
      ngn: number;
    };
  };
}

export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  amount: {
    usd: number;
    ngn: number;
  };
  currency: 'USD' | 'NGN';
  paymentMethod: 'card' | 'bank_transfer' | 'ussd' | 'mobile_money' | 'crypto';
  split?: PaymentSplit;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  escrowStatus: 'held' | 'released' | 'disputed';
  createdAt: string;
  completedAt?: string;
}

interface PaymentContextType {
  calculatePaymentSplit: (amount: number, currency: 'USD' | 'NGN', hasAgent: boolean, agentCommission?: number) => PaymentSplit;
  processPayment: (paymentData: PaymentData) => Promise<Transaction>;
  getTransactionHistory: (userId: string) => Transaction[];
  getAllTransactions: () => Transaction[];
  getTransaction: (id: string) => Transaction | undefined;
  exchangeRate: { usdToNgn: number; ngnToUsd: number };
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export interface PaymentData {
  propertyId: string;
  buyerId: string;
  amount: {
    usd: number;
    ngn: number;
  };
  currency: 'USD' | 'NGN';
  paymentMethod: 'card' | 'bank_transfer' | 'ussd' | 'mobile_money' | 'crypto';
  split?: PaymentSplit;
  // Additional fields (e.g. contact details, card metadata) are allowed but ignored here
  [key: string]: unknown;
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const exchangeRate = { usdToNgn: 1600, ngnToUsd: 0.000625 }; // Mock exchange rate

  const calculatePaymentSplit = (
    amount: number, 
    currency: 'USD' | 'NGN', 
    hasAgent: boolean, 
    agentCommission: number = 10
  ): PaymentSplit => {
    const serviceFeePercentage = 3; // 3% service fee
    const ownerPercentage = hasAgent ? (100 - agentCommission - serviceFeePercentage) : (100 - serviceFeePercentage);

    const usdAmount = currency === 'USD' ? amount : amount * exchangeRate.ngnToUsd;
    const ngnAmount = currency === 'NGN' ? amount : amount * exchangeRate.usdToNgn;

    const split: PaymentSplit = {
      owner: {
        percentage: ownerPercentage,
        amount: {
          usd: (usdAmount * ownerPercentage) / 100,
          ngn: (ngnAmount * ownerPercentage) / 100
        }
      },
      serviceFee: {
        percentage: serviceFeePercentage,
        amount: {
          usd: (usdAmount * serviceFeePercentage) / 100,
          ngn: (ngnAmount * serviceFeePercentage) / 100
        }
      }
    };

    if (hasAgent) {
      split.agent = {
        percentage: agentCommission,
        amount: {
          usd: (usdAmount * agentCommission) / 100,
          ngn: (ngnAmount * agentCommission) / 100
        }
      };
    }

    return split;
  };

  const processPayment = async (paymentData: PaymentData): Promise<Transaction> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transaction: Transaction = {
      id: Date.now().toString(),
      propertyId: paymentData.propertyId,
      buyerId: paymentData.buyerId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      split: paymentData.split,
      status: 'completed',
      escrowStatus: 'held',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    setTransactions(prev => [...prev, transaction]);
    return transaction;
  };

  const getTransactionHistory = (userId: string) => {
    return transactions.filter(transaction => transaction.buyerId === userId);
  };

  const getAllTransactions = () => {
    return [...transactions];
  };

  const getTransaction = (id: string) => {
    return transactions.find(transaction => transaction.id === id);
  };

  return (
    <PaymentContext.Provider value={{
      calculatePaymentSplit,
      processPayment,
      getTransactionHistory,
      getAllTransactions,
      getTransaction,
      exchangeRate
    }}>
      {children}
    </PaymentContext.Provider>
  );
};