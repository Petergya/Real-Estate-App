import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import { usePayment, PaymentSplit } from '../contexts/PaymentContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Building, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Users,
  Percent
} from 'lucide-react';

const Payment: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { getProperty } = useProperty();
  const { calculatePaymentSplit, processPayment, exchangeRate } = usePayment();
  const { user } = useAuth();

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('USD');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSplit, setPaymentSplit] = useState<PaymentSplit | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  });

  const property = getProperty(propertyId!);

  useEffect(() => {
    if (property) {
      const split = calculatePaymentSplit(
        selectedCurrency === 'USD' ? property.price.usd : property.price.ngn,
        selectedCurrency,
        !!property.agent,
        property.agent?.commission
      );
      setPaymentSplit(split);
    }
  }, [property, selectedCurrency, calculatePaymentSplit]);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button onClick={() => navigate('/properties')} className="text-blue-600 hover:text-blue-700">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const paymentData = {
        propertyId: property.id,
        buyerId: user.id,
        amount: {
          usd: property.price.usd,
          ngn: property.price.ngn
        },
        currency: selectedCurrency,
        paymentMethod,
        split: paymentSplit,
        ...formData
      };

      await processPayment(paymentData);
      setPaymentComplete(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed and funds are being held in escrow until the transaction is verified.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Browse More Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = selectedCurrency === 'USD' ? property.price.usd : property.price.ngn;
  const currencySymbol = selectedCurrency === 'USD' ? '$' : '₦';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/property/${propertyId}`)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Property
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Secure payment processing with automatic fund distribution</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Currency Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Currency
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USD')}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      selectedCurrency === 'USD'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <DollarSign className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">USD</div>
                    <div className="text-sm text-gray-600">${property.price.usd.toLocaleString()}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('NGN')}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      selectedCurrency === 'NGN'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Building className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">NGN</div>
                    <div className="text-sm text-gray-600">₦{property.price.ngn.toLocaleString()}</div>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: Building },
                    { value: 'ussd', label: 'USSD (Nigeria)', icon: Shield }
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label key={method.value} className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <Icon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Card Details (if card payment selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 801 234 5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Pay {currencySymbol}{totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Summary</h3>
              <div className="flex space-x-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                  <p className="text-sm text-gray-600">{property.location.city}, {property.location.state}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'for-sale' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            {paymentSplit && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Payment Distribution
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">Property Owner</div>
                      <div className="text-sm text-gray-600">{property.owner.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {currencySymbol}{(selectedCurrency === 'USD' ? paymentSplit.owner.amount.usd : paymentSplit.owner.amount.ngn).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {paymentSplit.owner.percentage}%
                      </div>
                    </div>
                  </div>

                  {paymentSplit.agent && property.agent && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                      <div>
                        <div className="font-medium text-gray-900">Agent Commission</div>
                        <div className="text-sm text-gray-600">{property.agent.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {currencySymbol}{(selectedCurrency === 'USD' ? paymentSplit.agent.amount.usd : paymentSplit.agent.amount.ngn).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Percent className="h-3 w-3 mr-1" />
                          {paymentSplit.agent.percentage}%
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium text-gray-900">Service Fee</div>
                      <div className="text-sm text-gray-600">RealEstate Pro</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {currencySymbol}{(selectedCurrency === 'USD' ? paymentSplit.serviceFee.amount.usd : paymentSplit.serviceFee.amount.ngn).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {paymentSplit.serviceFee.percentage}%
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-gray-900">Total Amount</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {currencySymbol}{totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Secure Escrow Payment</h4>
                  <p className="text-sm text-blue-700">
                    Your payment will be held securely in escrow until the property transaction is verified and completed. 
                    All parties will be notified once funds are released.
                  </p>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Exchange Rate:</span>
                <span className="font-medium">1 USD = ₦{exchangeRate.usdToNgn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;