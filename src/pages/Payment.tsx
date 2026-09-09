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
  ArrowLeft,
  Users,
  Percent,
  Phone
} from 'lucide-react';

const Payment: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { getProperty } = useProperty();
  const { calculatePaymentSplit, processPayment, exchangeRate } = usePayment();
  const { user } = useAuth();

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('USD');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd' | 'mobile_money' | 'crypto'>('card');
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">Property Not Found</h2>
          <button onClick={() => navigate('/properties')} className="text-gold hover:text-secondary">
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
        split: paymentSplit || undefined,
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ink mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed and funds are being held in escrow until the transaction is verified.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
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
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/property/${propertyId}`)}
            className="flex items-center text-gold hover:text-secondary transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Property
          </button>
          <h1 className="text-3xl font-bold text-ink">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Secure payment processing with automatic fund distribution</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-ink mb-6">Payment Details</h2>

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
                        ? 'border-primary bg-light/50 text-accent'
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
                        ? 'border-primary bg-light/50 text-accent'
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
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Details (if bank_transfer selected) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-gold/10 border border-gold/40 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <Building className="h-6 w-6 text-gold mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-navy mb-1">Bank Transfer Details</h4>
                      <p className="text-sm text-navy mb-4">Please transfer the exact amount to the account below. Your transaction will be verified automatically.</p>
                      
                      <div className="bg-white rounded p-3 border border-gold/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Bank Name</span>
                          <span className="font-medium text-ink">UBA</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Account Name</span>
                          <span className="font-medium text-ink">Habixa Properties</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Account Number</span>
                          <span className="font-mono font-bold text-lg text-gold tracking-wider">0123456789</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Amount to Transfer</span>
                          <span className="font-medium text-ink">{selectedCurrency === 'USD' ? `$${property.price.usd.toLocaleString()}` : `₦${property.price.ngn.toLocaleString()}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                      Sender's Name (To help verify your payment)
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      placeholder="Name on your bank account"
                      className="w-full px-3 py-2 border border-gold/40 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                      required={paymentMethod === 'bank_transfer'}
                    />
                  </div>
                </div>
              )}

              {/* USSD Details (if ussd selected) */}
              {paymentMethod === 'ussd' && (
                <div className="bg-gold/10 border border-gold/40 rounded-lg p-4 space-y-4">
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-gold mt-1 mr-3 flex-shrink-0" />
                    <div className="w-full">
                      <h4 className="font-semibold text-navy mb-1">Pay with USSD</h4>
                      <p className="text-sm text-navy mb-4">Select your bank below to generate a secure USSD code.</p>
                      
                      <select 
                        className="w-full px-3 py-2 border border-gold/40 rounded-md focus:ring-2 focus:ring-gold bg-white mb-4"
                        required={paymentMethod === 'ussd'}
                      >
                        <option value="">Select your Bank</option>
                        <option value="access">Access Bank (*901#)</option>
                        <option value="access_diamond">Access Bank (Diamond) (*426#)</option>
                        <option value="alat">ALAT by WEMA (*945#)</option>
                        <option value="ecobank">Ecobank (*326#)</option>
                        <option value="fcmb">FCMB (*329#)</option>
                        <option value="fidelity">Fidelity Bank (*770#)</option>
                        <option value="firstbank">First Bank (*894#)</option>
                        <option value="gtb">Guaranty Trust Bank (*737#)</option>
                        <option value="heritage">Heritage Bank (*745#)</option>
                        <option value="keystone">Keystone Bank (*7111#)</option>
                        <option value="polaris">Polaris Bank (*833#)</option>
                        <option value="providus">Providus Bank (*822#)</option>
                        <option value="stanbic_ibtc">Stanbic IBTC Bank (*909#)</option>
                        <option value="standard_chartered">Standard Chartered Bank (*977#)</option>
                        <option value="sterling">Sterling Bank (*822#)</option>
                        <option value="uba">UBA (*919#)</option>
                        <option value="union">Union Bank (*826#)</option>
                        <option value="unity">Unity Bank (*7799#)</option>
                        <option value="wema">Wema Bank (*945#)</option>
                        <option value="zenith">Zenith Bank (*966#)</option>
                      </select>

                      <div className="bg-white rounded p-4 border border-gold/30 text-center">
                        <p className="text-sm text-gray-500 mb-2">Dial this code on your mobile phone:</p>
                        <div className="font-mono text-2xl font-bold text-gold tracking-wider bg-gold/10 py-2 rounded border border-dashed border-gold/50">
                          *000*000#
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Code expires in 5:00 minutes</p>
                      </div>
                    </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-navy text-white py-3 px-4 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
              <h3 className="text-lg font-semibold text-ink mb-4">Property Summary</h3>
              <div className="flex space-x-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-ink mb-1">{property.title}</h4>
                  <p className="text-sm text-gray-600">{property.location.city}, {property.location.state}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'for-sale' 
                        ? 'bg-gold/15 text-navy' 
                        : 'bg-light/70 text-accent'
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
                <h3 className="text-lg font-semibold text-ink mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Payment Distribution
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gold/10 rounded-md">
                    <div>
                      <div className="font-medium text-ink">Property Owner</div>
                      <div className="text-sm text-gray-600">{property.owner.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-ink">
                        {currencySymbol}{(selectedCurrency === 'USD' ? paymentSplit.owner.amount.usd : paymentSplit.owner.amount.ngn).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {paymentSplit.owner.percentage}%
                      </div>
                    </div>
                  </div>

                  {paymentSplit.agent && property.agent && (
                    <div className="flex justify-between items-center p-3 bg-light/40 rounded-md">
                      <div>
                        <div className="font-medium text-ink">Agent Commission</div>
                        <div className="text-sm text-gray-600">{property.agent.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-ink">
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
                      <div className="font-medium text-ink">Service Fee</div>
                      <div className="text-sm text-gray-600">Habixa Properties</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-ink">
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
                      <div className="text-lg font-semibold text-ink">Total Amount</div>
                      <div className="text-lg font-semibold text-ink">
                        {currencySymbol}{totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-light/40 border border-light rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gold mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-accent mb-1">Secure Escrow Payment</h4>
                  <p className="text-sm text-primary">
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