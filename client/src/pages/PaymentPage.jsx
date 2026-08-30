import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import paymentService from '../services/paymentService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RazorpayCheckout } from '../components/RazorpayCheckout';
import {
  CreditCard,
  ShieldCheck,
  MapPin,
  Package,
  Loader2,
  AlertCircle,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  QrCode,
  Truck,
  Edit2,
  ChevronRight
} from 'lucide-react';

export const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Selected Payment Method & Forms State
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  const [upiOption, setUpiOption] = useState('id'); // 'id' | 'qr'
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [otherBank, setOtherBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);

  // Load Order Details & Initialize Razorpay Payment Order
  useEffect(() => {
    const initPayment = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch Order
        const orderRes = await api.get(`/orders/${orderId}`);
        if (orderRes && orderRes.success && orderRes.data?.order) {
          const ord = orderRes.data.order;
          setOrder(ord);

          if (ord.paymentStatus === 'CAPTURED' || ord.paymentStatus === 'PAID') {
            navigate(`/payment/success/${orderId}`);
            return;
          }

          // 2. Initialize Payment Order
          const payRes = await paymentService.createPaymentOrder(orderId);
          if (payRes && payRes.success && payRes.data) {
            setPaymentData(payRes.data);
          }
        }
      } catch (err) {
        setErrorMsg(err.message || 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      initPayment();
    }
  }, [orderId, navigate]);

  // Handle Successful Razorpay Checkout Callback
  const handlePaymentSuccess = async (razorpayResponse) => {
    try {
      setIsVerifying(true);
      showToast('Verifying payment signature with server...', 'info');

      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature
      });

      if (verifyRes && verifyRes.success) {
        showToast('Payment captured successfully!', 'success');
        navigate(`/payment/success/${orderId}`);
      }
    } catch (err) {
      showToast(err.message || 'Payment verification failed', 'error');
      navigate(`/payment/failed/${orderId}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Payment Failure
  const handlePaymentFailure = async (error) => {
    try {
      if (paymentData?.paymentId) {
        await paymentService.markPaymentFailed(
          paymentData.paymentId,
          error.description || 'Payment attempt failed or declined'
        );
      }
    } catch (e) {
      console.warn('Could not record payment failure:', e.message);
    }
    showToast(error.description || 'Payment processing failed', 'error');
    navigate(`/payment/failed/${orderId}`);
  };

  // Dynamic Button Text calculation
  const getButtonText = () => {
    const totalFormatted = formatCurrency(order?.total);
    if (selectedMethod === 'upi') return `Verify & Pay ${totalFormatted}`;
    if (selectedMethod === 'card') return `Pay ${totalFormatted}`;
    if (selectedMethod === 'netbanking') return `Continue to Payment ${totalFormatted}`;
    if (selectedMethod === 'wallet') return `Pay ${totalFormatted} with ${selectedWallet}`;
    if (selectedMethod === 'cod') return `Place Order (COD ${totalFormatted})`;
    return `Pay ${totalFormatted}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-xs text-[#212121]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2874F0]" />
        <p className="font-bold text-gray-700">Loading payment checkout options...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm text-center space-y-4 text-xs text-[#212121]">
        <AlertCircle className="w-12 h-12 text-[#D32F2F] mx-auto" />
        <h3 className="text-xl font-bold text-gray-900">Payment Error</h3>
        <p className="text-xs text-gray-500">{errorMsg || 'Order not found'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2.5 bg-[#2874F0] text-white font-bold rounded-xl text-xs shadow-sm"
        >
          View My Orders
        </button>
      </div>
    );
  }

  const itemsCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || order.items?.length || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs text-[#212121]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Select Payment Method</h1>
          <p className="text-xs text-gray-500">
            Order Reference: <strong className="text-gray-900">{order.orderNumber}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#008C45]" />
          <span className="text-xs font-bold text-gray-700">100% Verified Secure Transaction</span>
        </div>
      </div>

      {isVerifying ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3 shadow-sm animate-pulse">
          <Loader2 className="w-10 h-10 animate-spin text-[#2874F0] mx-auto" />
          <h3 className="text-base font-bold text-gray-900">Verifying Server Signature...</h3>
          <p className="text-xs text-gray-500">Please wait while server confirms order payment signature.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Address, Order Summary, & Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* 1. Delivery Address Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">1</span>
                  <MapPin className="w-4 h-4 text-[#2874F0]" />
                  <span>DELIVERY ADDRESS</span>
                </div>
                <Link to="/checkout" className="text-xs font-bold text-[#2874F0] hover:underline flex items-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" /> Change Address
                </Link>
              </div>

              <div className="text-xs text-gray-700 leading-normal pl-8">
                <div className="font-bold text-gray-900 text-sm">{order.shippingAddress?.fullName}</div>
                <div>{order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</div>
                <div className="font-bold text-gray-800">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</div>
                <div className="text-gray-500 font-medium pt-0.5">Phone: {order.shippingAddress?.phone}</div>
              </div>
            </div>

            {/* 2. Order Items Compact Summary */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">2</span>
                <Package className="w-4 h-4 text-[#2874F0]" />
                <span>ORDER ITEMS ({itemsCount} Items)</span>
              </div>

              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80'}
                        alt={item.productName}
                        className="w-10 h-10 rounded object-contain bg-white border border-gray-200 p-0.5"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{item.productName}</div>
                        <div className="text-[10px] text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                      </div>
                    </div>

                    <div className="font-black text-gray-900 text-xs">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Select Payment Method Section */}
            <div className="bg-white p-5 rounded-xl border-2 border-[#2874F0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#2874F0] text-white font-black text-xs flex items-center justify-center">3</span>
                <CreditCard className="w-4 h-4 text-[#2874F0]" />
                <span>PAYMENT OPTIONS</span>
              </div>

              {/* Vertical Payment Method List */}
              <div className="space-y-3">
                
                {/* OPTION 1: UPI */}
                <div
                  className={`border rounded-xl transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-[#2874F0] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setSelectedMethod('upi')}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === 'upi'}
                        onChange={() => setSelectedMethod('upi')}
                        className="w-4 h-4 text-[#2874F0] focus:ring-0"
                      />
                      <Smartphone className="w-5 h-5 text-[#2874F0]" />
                      <div>
                        <div className="font-bold text-gray-900 text-xs">UPI (Google Pay, PhonePe, Paytm, BHIM)</div>
                        <div className="text-[10px] text-gray-500">Instant payment using any UPI App or QR</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMethod === 'upi' ? 'rotate-90 text-[#2874F0]' : 'text-gray-400'}`} />
                  </label>

                  {/* UPI Form */}
                  {selectedMethod === 'upi' && (
                    <div className="p-4 pt-0 border-t border-blue-100 space-y-3">
                      <div className="flex gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setUpiOption('id')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            upiOption === 'id'
                              ? 'bg-[#2874F0] text-white'
                              : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        >
                          Enter UPI ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiOption('qr')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                            upiOption === 'qr'
                              ? 'bg-[#2874F0] text-white'
                              : 'bg-white border border-gray-300 text-gray-700'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Pay using UPI QR</span>
                        </button>
                      </div>

                      {upiOption === 'id' ? (
                        <div className="space-y-2 max-w-sm">
                          <label className="block text-xs font-bold text-gray-700">UPI ID / VPA *</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. name@okaxis or 9876543210@paytm"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4 max-w-sm">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-2">
                            <QrCode className="w-16 h-16 text-[#2874F0]" />
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="font-bold text-gray-900">Scan QR Code</div>
                            <p className="text-[11px]">Open GPay, PhonePe, or Paytm and scan to pay <strong>{formatCurrency(order.total)}</strong></p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* OPTION 2: Credit / Debit Card */}
                <div
                  className={`border rounded-xl transition-all ${
                    selectedMethod === 'card'
                      ? 'border-[#2874F0] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setSelectedMethod('card')}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === 'card'}
                        onChange={() => setSelectedMethod('card')}
                        className="w-4 h-4 text-[#2874F0] focus:ring-0"
                      />
                      <CreditCard className="w-5 h-5 text-[#2874F0]" />
                      <div>
                        <div className="font-bold text-gray-900 text-xs">Credit / Debit Card</div>
                        <div className="text-[10px] text-gray-500">Visa, Mastercard, RuPay, Maestro</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMethod === 'card' ? 'rotate-90 text-[#2874F0]' : 'text-gray-400'}`} />
                  </label>

                  {/* Card Form */}
                  {selectedMethod === 'card' && (
                    <div className="p-4 pt-0 border-t border-blue-100 space-y-3">
                      <div className="space-y-3 pt-3 max-w-md">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Card Number *</label>
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                            placeholder="4111 1111 1111 1111"
                            maxLength={19}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#2874F0]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Expiry (MM/YY) *</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              placeholder="12 / 28"
                              maxLength={5}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#2874F0]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">CVV *</label>
                            <input
                              type="password"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              placeholder="•••"
                              maxLength={4}
                              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#2874F0]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Cardholder Name *</label>
                          <input
                            type="text"
                            value={cardData.nameOnCard}
                            onChange={(e) => setCardData({ ...cardData, nameOnCard: e.target.value })}
                            placeholder="Name on card"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                          />
                        </div>

                        <div className="text-[10px] text-gray-500 flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#008C45]" />
                          <span>Your card details are securely processed by the payment provider.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 3: Net Banking */}
                <div
                  className={`border rounded-xl transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-[#2874F0] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setSelectedMethod('netbanking')}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === 'netbanking'}
                        onChange={() => setSelectedMethod('netbanking')}
                        className="w-4 h-4 text-[#2874F0] focus:ring-0"
                      />
                      <Building2 className="w-5 h-5 text-[#2874F0]" />
                      <div>
                        <div className="font-bold text-gray-900 text-xs">Net Banking</div>
                        <div className="text-[10px] text-gray-500">All major Indian banks supported</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMethod === 'netbanking' ? 'rotate-90 text-[#2874F0]' : 'text-gray-400'}`} />
                  </label>

                  {/* Net Banking Form */}
                  {selectedMethod === 'netbanking' && (
                    <div className="p-4 pt-0 border-t border-blue-100 space-y-3">
                      <div className="space-y-2 pt-3">
                        <label className="block text-xs font-bold text-gray-700">Popular Banks:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['HDFC', 'ICICI', 'SBI', 'AXIS'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                                selectedBank === bank
                                  ? 'bg-blue-50 border-[#2874F0] text-[#2874F0]'
                                  : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                              }`}
                            >
                              {bank} Bank
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Other Banks:</label>
                          <select
                            value={otherBank}
                            onChange={(e) => setOtherBank(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-[#2874F0]"
                          >
                            <option value="">-- Select Bank --</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                            <option value="BOB">Bank of Baroda</option>
                            <option value="INDUSIND">IndusInd Bank</option>
                            <option value="IDFC">IDFC FIRST Bank</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 4: Wallets */}
                <div
                  className={`border rounded-xl transition-all ${
                    selectedMethod === 'wallet'
                      ? 'border-[#2874F0] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setSelectedMethod('wallet')}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === 'wallet'}
                        onChange={() => setSelectedMethod('wallet')}
                        className="w-4 h-4 text-[#2874F0] focus:ring-0"
                      />
                      <Wallet className="w-5 h-5 text-[#2874F0]" />
                      <div>
                        <div className="font-bold text-gray-900 text-xs">Wallets</div>
                        <div className="text-[10px] text-gray-500">Paytm Wallet, PhonePe, Amazon Pay, MobiKwik</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMethod === 'wallet' ? 'rotate-90 text-[#2874F0]' : 'text-gray-400'}`} />
                  </label>

                  {/* Wallet Form */}
                  {selectedMethod === 'wallet' && (
                    <div className="p-4 pt-0 border-t border-blue-100 space-y-3">
                      <div className="space-y-2 pt-3">
                        <label className="block text-xs font-bold text-gray-700">Select Wallet:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWallet(w)}
                              className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                                selectedWallet === w
                                  ? 'bg-blue-50 border-[#2874F0] text-[#2874F0]'
                                  : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 5: Cash on Delivery (COD) */}
                <div
                  className={`border rounded-xl transition-all ${
                    selectedMethod === 'cod'
                      ? 'border-[#2874F0] bg-blue-50/40 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <label
                    onClick={() => setSelectedMethod('cod')}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === 'cod'}
                        onChange={() => setSelectedMethod('cod')}
                        className="w-4 h-4 text-[#2874F0] focus:ring-0"
                      />
                      <Truck className="w-5 h-5 text-[#2874F0]" />
                      <div>
                        <div className="font-bold text-gray-900 text-xs">Cash on Delivery (COD)</div>
                        <div className="text-[10px] text-gray-500">Pay cash upon order delivery</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedMethod === 'cod' ? 'rotate-90 text-[#2874F0]' : 'text-gray-400'}`} />
                  </label>

                  {/* COD Form */}
                  {selectedMethod === 'cod' && (
                    <div className="p-4 pt-0 border-t border-blue-100 space-y-2">
                      <div className="p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 space-y-1">
                        <div className="font-bold text-[#008C45] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-[#008C45]" />
                          <span>Pay cash when your order is delivered.</span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Order will be confirmed and sent to merchant fulfillment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Price Details & Dynamic Razorpay Button */}
          <div className="lg:col-span-1 sticky top-24 space-y-4">
            
            {/* Price Details Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider pb-2 border-b border-gray-100">
                PRICE DETAILS
              </h3>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Price ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-[#008C45] font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#008C45]">{order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(order.tax)}</span>
                </div>

                <div className="flex justify-between font-black text-gray-900 text-sm pt-3 border-t border-gray-200 border-dashed">
                  <span>Total Amount</span>
                  <span className="text-base text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {order.discount > 0 && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-[11px]">
                  You will save {formatCurrency(order.discount)} on this order!
                </div>
              )}

              {/* Dynamic Payment CTA Button */}
              <div className="pt-2">
                <RazorpayCheckout
                  paymentData={paymentData}
                  customerInfo={{
                    name: user?.name || order.shippingAddress?.fullName,
                    email: user?.email || '',
                    phone: order.shippingAddress?.phone || user?.phone || ''
                  }}
                  selectedMethod={selectedMethod}
                  buttonText={getButtonText()}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                />
              </div>

              <div className="pt-2 text-[10px] text-gray-500 flex items-center justify-center gap-1 font-semibold border-t border-gray-100">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008C45]" />
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default PaymentPage;
