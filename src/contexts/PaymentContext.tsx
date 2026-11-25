import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from './AuthContext';
import { db, functions } from '../lib/firebase';

export interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerId: string;
  amount: {
    usd: number;
    ngn: number;
  };
  currency: 'NGN';
  paymentMethod: 'paystack';
  settlement: 'merchant';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  reference: string;
  createdAt: string;
  completedAt?: string;
}

interface CheckoutSession {
  authorizationUrl: string;
  reference: string;
  transactionId: string;
}

interface PaymentContextType {
  processPayment: (propertyId: string) => Promise<CheckoutSession>;
  verifyPayment: (reference: string) => Promise<'pending' | 'completed' | 'failed'>;
  getTransactionHistory: (userId: string) => Transaction[];
  getAllTransactions: () => Transaction[];
  getTransaction: (id: string) => Transaction | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within a PaymentProvider');
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user || !db) {
      setTransactions([]);
      return;
    }

    const transactionsQuery = user.role === 'admin'
      ? query(collection(db, 'transactions'))
      : query(collection(db, 'transactions'), where('buyerId', '==', user.id));
    return onSnapshot(transactionsQuery, (snapshot) => {
      setTransactions(snapshot.docs.map((transaction) => ({
        id: transaction.id,
        ...transaction.data(),
      }) as Transaction));
    }, (error) => {
      console.error('Unable to load payment history', error);
      setTransactions([]);
    });
  }, [user]);

  const processPayment = async (propertyId: string): Promise<CheckoutSession> => {
    if (!functions) throw new Error('Firebase is not configured. Payments are unavailable until Firebase is connected.');
    const initializeCheckout = httpsCallable<{ propertyId: string }, CheckoutSession>(functions, 'initializePaystackCheckout');
    const response = await initializeCheckout({ propertyId });
    return response.data;
  };

  const verifyPayment = async (reference: string): Promise<'pending' | 'completed' | 'failed'> => {
    if (!functions) throw new Error('Firebase is not configured. Payments are unavailable until Firebase is connected.');
    const verifyCheckout = httpsCallable<{ reference: string }, { status: 'pending' | 'completed' | 'failed' }>(
      functions,
      'verifyPaystackCheckout',
    );
    const response = await verifyCheckout({ reference });
    return response.data.status;
  };

  const getTransactionHistory = (userId: string) => transactions.filter((transaction) => transaction.buyerId === userId);
  const getAllTransactions = () => user?.role === 'admin' ? [...transactions] : [];
  const getTransaction = (id: string) => transactions.find((transaction) => transaction.id === id);

  return (
    <PaymentContext.Provider value={{
      processPayment,
      verifyPayment,
      getTransactionHistory,
      getAllTransactions,
      getTransaction,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
