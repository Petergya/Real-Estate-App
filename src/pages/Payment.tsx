import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ExternalLink, Loader2, ShieldAlert } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { usePayment } from '../contexts/PaymentContext';
import { useAuth } from '../contexts/AuthContext';

const Payment: React.FC = () => {
  const { propertyId = '' } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getProperty } = useProperty();
  const { processPayment, verifyPayment } = usePayment();
  const { user } = useAuth();
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'pending' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState('');
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const property = getProperty(propertyId);

  const checkPayment = useCallback(async () => {
    if (!reference) return;
    setVerificationStatus('checking');
    setError('');
    try {
      setVerificationStatus(await verifyPayment(reference));
    } catch (verificationError) {
      console.error('Paystack verification failed', verificationError);
      setVerificationStatus('failed');
      setError('We could not verify this payment yet. Please try checking again or contact support with your Paystack reference.');
    }
  }, [reference, verifyPayment]);

  useEffect(() => {
    if (reference) void checkPayment();
  }, [reference, checkPayment]);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/payment/${propertyId}` } });
      return;
    }
    setIsStartingCheckout(true);
    setError('');
    try {
      const checkout = await processPayment(propertyId);
      window.location.assign(checkout.authorizationUrl);
    } catch (checkoutError) {
      console.error('Unable to initialize Paystack checkout', checkoutError);
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start secure checkout. Please try again.');
      setIsStartingCheckout(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Property Not Found</h1>
          <button onClick={() => navigate('/properties')} className="text-primary hover:text-secondary">
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/property/${propertyId}`)}
          className="flex items-center text-primary hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Property
        </button>
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          {verificationStatus === 'completed' ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-ink mb-3">Payment Confirmed</h1>
              <p className="text-gray-600 mb-6">
                Paystack confirmed your payment. The payment is settled to Habixa Properties&apos; merchant account; it is not held in escrow.
              </p>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-navy text-white py-3 rounded-md hover:bg-secondary">
                Go to Dashboard
              </button>
            </div>
          ) : reference ? (
            <div className="text-center">
              {verificationStatus === 'checking'
                ? <Loader2 className="h-14 w-14 text-primary mx-auto mb-4 animate-spin" />
                : <ShieldAlert className="h-14 w-14 text-amber-500 mx-auto mb-4" />}
              <h1 className="text-2xl font-bold text-ink mb-3">
                {verificationStatus === 'checking' ? 'Verifying Your Payment' : 'Payment Not Confirmed'}
              </h1>
              <p className="text-gray-600 mb-3">
                {verificationStatus === 'checking'
                  ? 'Checking the payment status directly with Paystack. Please wait.'
                  : verificationStatus === 'pending'
                    ? 'Paystack has not confirmed this payment yet. Do not retry if you were charged; check again shortly or contact support.'
                    : error || 'The payment was not confirmed. You can try again or contact support if you believe you were charged.'}
              </p>
              <p className="text-xs text-gray-500 break-all mb-6">Reference: {reference}</p>
              {verificationStatus !== 'checking' && (
                <div className="space-y-3">
                  <button onClick={() => void checkPayment()} className="w-full bg-navy text-white py-3 rounded-md hover:bg-secondary">
                    Check Payment Status
                  </button>
                  <button onClick={() => navigate(`/payment/${propertyId}`)} className="w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50">
                    Return to Checkout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-ink mb-2">Secure Checkout</h1>
              <p className="text-gray-600 mb-6">Complete your payment on Paystack&apos;s secure hosted checkout page.</p>
              <div className="flex gap-4 border border-gray-200 rounded-lg p-4 mb-6">
                <img src={property.images[0]} alt="" className="w-24 h-20 rounded-md object-cover" />
                <div>
                  <h2 className="font-semibold text-ink">{property.title}</h2>
                  <p className="text-sm text-gray-500">{property.location.city}, {property.location.state}</p>
                  <p className="font-bold text-primary mt-1">₦{property.price.ngn.toLocaleString()}</p>
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 mb-6 text-sm text-blue-900">
                Your card details are entered only on Paystack. Payments are processed in NGN and settled to the merchant account; this service does not provide escrow.
              </div>
              {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-md p-3 mb-4">{error}</p>}
              <button
                type="button"
                onClick={() => void handleCheckout()}
                disabled={isStartingCheckout}
                className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-md hover:bg-secondary disabled:opacity-60"
              >
                {isStartingCheckout
                  ? <><Loader2 className="h-5 w-5 animate-spin" /> Connecting to Paystack…</>
                  : <>Continue to Paystack <ExternalLink className="h-4 w-4" /></>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
