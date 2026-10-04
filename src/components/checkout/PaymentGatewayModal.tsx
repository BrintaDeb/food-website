'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  QrCode,
  Smartphone,
  Loader2,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentInfo: {
    paymentMethod: string;
    utr: string;
    transactionId: string;
    paidAt: string;
  }) => Promise<void>;
  amount: number;
  customerName: string;
  customerPhone: string;
}

export function PaymentGatewayModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  customerName,
  customerPhone
}: PaymentGatewayModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card'>('upi');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(customerName || '');

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeLeft(300);
      setIsProcessing(false);
      setIsSuccess(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || isSuccess) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft, isSuccess]);

  // Web Audio Victory Chime (no external asset needed)
  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.1); // A5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // Audio might be blocked by browser autoplay policy
    }
  };

  const handleSimulatePayment = async (methodName: string) => {
    try {
      setIsProcessing(true);
      // Simulate real-time bank switch authentication
      await new Promise((r) => setTimeout(r, 1600));

      const randomUtr = `UTR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const randomTxn = `PAY-${Date.now().toString().slice(-8)}`;

      setIsSuccess(true);
      playSuccessChime();
      toast.show('Payment Verified! Authentication response received from bank switch.', 'success');

      await new Promise((r) => setTimeout(r, 1200));

      await onSuccess({
        paymentMethod: methodName,
        utr: randomUtr,
        transactionId: randomTxn,
        paidAt: new Date().toISOString()
      });
    } catch {
      toast.show('Payment processing error. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNum = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      return `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    return raw;
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(0rem,env(safe-area-inset-bottom,0px))]">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[94dvh] overflow-y-auto touch-scroll shadow-2xl border border-stone-200 relative flex flex-col">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-[#1A1311] to-[#251C1A] text-white flex items-center justify-between rounded-t-3xl relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center text-white text-xl shadow-md">
              🍛
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-outfit font-black text-lg text-white">CurryCraft Pay</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck size={10} /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-neutral-400">Authentic Indian Gourmet Dining</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close payment modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount & Timer Bar */}
        <div className="bg-[#FFFDF9] border-b border-[#E8E5E0] px-6 py-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-400 font-semibold block">TOTAL PAYABLE</span>
            <span className="font-outfit font-black text-2xl text-[#FF5E00]">
              {formatINR(amount)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#FF5E00] font-mono font-bold">
            <Clock size={13} className="animate-spin" />
            <span>
              {minutes}:{seconds}
            </span>
          </div>
        </div>

        {/* Success State Overlay */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-outfit font-black text-2xl text-stone-900">Payment Successful!</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Your transaction has been confirmed by the bank. Generating your official CurryCraft
              order receipt...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-stone-600 pt-2">
              <Sparkles size={14} className="text-[#FF5E00]" />
              <span>Redirecting to Order Ticket...</span>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 flex-1">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <QrCode size={15} className="text-[#FF5E00]" />
                <span>Instant UPI & QR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <CreditCard size={15} className="text-blue-500" />
                <span>Debit / Credit Card</span>
              </button>
            </div>

            {/* =========================================================================
                TAB 1: UPI & QR CODE
                ========================================================================= */}
            {activeTab === 'upi' && (
              <div className="space-y-4">
                {/* QR Code Container */}
                <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-[#E8E5E0] text-center space-y-3">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Scan with any UPI App (GPay, PhonePe, Paytm, CRED)
                  </span>

                  {/* High Fidelity Dynamic SVG UPI QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-stone-300 shadow-inner flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                      {/* Stylized QR Position Markers */}
                      <rect x="5" y="5" width="28" height="28" rx="4" fill="currentColor" />
                      <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
                      <rect x="13" y="13" width="12" height="12" rx="1" fill="#FF5E00" />

                      <rect x="67" y="5" width="28" height="28" rx="4" fill="currentColor" />
                      <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
                      <rect x="75" y="13" width="12" height="12" rx="1" fill="#FF5E00" />

                      <rect x="5" y="67" width="28" height="28" rx="4" fill="currentColor" />
                      <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
                      <rect x="13" y="75" width="12" height="12" rx="1" fill="#FF5E00" />

                      {/* Simulated QR Data Matrix */}
                      <rect x="38" y="8" width="5" height="5" fill="currentColor" />
                      <rect x="48" y="14" width="5" height="5" fill="currentColor" />
                      <rect x="56" y="8" width="5" height="5" fill="currentColor" />
                      <rect x="42" y="24" width="5" height="5" fill="currentColor" />
                      <rect x="52" y="22" width="6" height="6" fill="currentColor" />

                      <rect x="10" y="38" width="6" height="5" fill="currentColor" />
                      <rect x="22" y="44" width="5" height="5" fill="currentColor" />
                      <rect x="8" y="52" width="5" height="6" fill="currentColor" />
                      <rect x="20" y="56" width="6" height="5" fill="currentColor" />

                      <rect x="72" y="38" width="5" height="5" fill="currentColor" />
                      <rect x="84" y="44" width="6" height="5" fill="currentColor" />
                      <rect x="76" y="54" width="5" height="5" fill="currentColor" />
                      <rect x="86" y="56" width="5" height="5" fill="currentColor" />

                      <rect x="38" y="68" width="5" height="5" fill="currentColor" />
                      <rect x="48" y="74" width="6" height="5" fill="currentColor" />
                      <rect x="42" y="84" width="5" height="6" fill="currentColor" />
                      <rect x="54" y="86" width="5" height="5" fill="currentColor" />
                      <rect x="68" y="78" width="5" height="5" fill="currentColor" />
                      <rect x="82" y="82" width="6" height="5" fill="currentColor" />

                      {/* Center CurryCraft Royal Shield */}
                      <circle cx="50" cy="50" r="14" fill="#FF5E00" />
                      <text
                        x="50"
                        y="55"
                        fill="white"
                        fontSize="12"
                        fontWeight="900"
                        textAnchor="middle"
                        fontFamily="Outfit, sans-serif"
                      >
                        ₹
                      </text>
                    </svg>

                    <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-1">
                      currycraft@icici
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Point your camera or open your favorite UPI app to scan and pay instantly.
                  </p>
                </div>

                {/* 1-Tap UPI App Launchers */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">
                    Or Pay with Installed UPI Apps:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢 GPay' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵 Paytm' },
                      { id: 'cred', name: 'CRED UPI', icon: '⚡ CRED' }
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer min-h-[44px] flex items-center justify-center ${
                          selectedUpiApp === app.id
                            ? 'border-[#FF5E00] bg-[#FF5E00]/5 text-[#FF5E00] ring-1 ring-[#FF5E00]'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {app.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm / Simulate Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    handleSimulatePayment(
                      selectedUpiApp === 'gpay'
                        ? 'Google Pay (UPI)'
                        : selectedUpiApp === 'phonepe'
                          ? 'PhonePe (UPI)'
                          : selectedUpiApp === 'paytm'
                            ? 'Paytm (UPI)'
                            : 'CRED (UPI)'
                    )
                  }
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#FF5E00] to-[#E04800] hover:from-[#FF7324] hover:to-[#EB5505] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#FF5E00]/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Verifying UPI Authorization...
                    </>
                  ) : (
                    <>
                      <span>Simulate Instant UPI Approval ({formatINR(amount)})</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* =========================================================================
                TAB 2: DEBIT / CREDIT CARDS
                ========================================================================= */}
            {activeTab === 'card' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimulatePayment(
                    `Card (ending in ${cardNumber.replace(/\s/g, '').slice(-4) || '4242'})`
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#FF5E00] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNum(e.target.value))}
                      placeholder="4532 •••• •••• 8912"
                      className="w-full pl-10 pr-16 py-3 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#FF5E00] min-h-[44px] font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 uppercase bg-stone-100 px-2 py-0.5 rounded">
                      RuPay / Visa
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#FF5E00] min-h-[44px] font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      CVV / CVC
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full pl-9 pr-3.5 py-3 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-[#FF5E00] min-h-[44px] font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#1A1311] to-[#2B1408] hover:bg-black text-white font-bold text-sm tracking-wide shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Authorizing 3D Secure OTP...
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Pay {formatINR(amount)} Securely</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Trust Bar */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" /> RBI &amp; NPCI Compliant
              </span>
              <span>Encrypted Banking Switch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
