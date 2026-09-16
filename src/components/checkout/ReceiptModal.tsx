'use client';

import Link from 'next/link';
import { X, Printer, ShoppingBag, Bike } from 'lucide-react';
import type { Order } from '@/types/order';
import { formatINR } from '@/lib/utils';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { label: 'Confirmed', icon: '✓', step: 1 },
    { label: 'In Kitchen', icon: '🔥', step: 2 },
    { label: 'On The Way', icon: '🛵', step: 3 },
    { label: 'Delivered', icon: '🎉', step: 4 }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receiptModalTitle"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5E0] animate-in zoom-in-95 duration-200">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors z-10"
          aria-label="Close receipt"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket */}
        <div id="printableReceipt" className="p-6 sm:p-8 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍛</span>
                <h2
                  id="receiptModalTitle"
                  className="text-2xl font-black font-outfit text-[#1A1311]"
                >
                  CurryCraft
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Authentic Heritage Indian Cuisine</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{order.status}</span>
              </span>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">ID: #{order.orderId}</p>
            </div>
          </div>

          {/* Live Delivery Progress Tracker Bar */}
          <div className="no-print bg-[#FFFDF9] p-4 rounded-2xl border border-[#E8E5E0]">
            <div className="grid grid-cols-4 gap-1 text-center">
              {steps.map((s) => {
                const isPassed = (order.statusStep || 1) >= s.step;
                return (
                  <div key={s.step} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isPassed
                          ? 'bg-[#FF5E00] text-white shadow-badge'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-1.5 ${
                        isPassed ? 'text-[#FF5E00]' : 'text-neutral-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-400 block font-semibold">CUSTOMER</span>
              <span className="font-bold text-neutral-800">{order.customer.name}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-semibold">PHONE</span>
              <span className="font-bold text-neutral-800">{order.customer.phone}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-semibold">ORDER DATE</span>
              <span className="font-bold text-neutral-800">
                {order.formattedDate} at {order.formattedTime}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block font-semibold">PAYMENT METHOD</span>
              <span className="font-bold text-neutral-800">{order.customer.paymentMethod}</span>
            </div>
            <div className="col-span-2">
              <span className="text-neutral-400 block font-semibold">DELIVERY DESTINATION</span>
              <span className="font-medium text-neutral-700">{order.customer.address}</span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="border-t border-dashed border-neutral-300 pt-4 space-y-2.5">
            <div className="grid grid-cols-12 text-xs font-bold text-neutral-400 pb-1 border-b border-neutral-100">
              <span className="col-span-6">ITEM</span>
              <span className="col-span-2 text-center">QTY</span>
              <span className="col-span-2 text-right">RATE</span>
              <span className="col-span-2 text-right">TOTAL</span>
            </div>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 text-xs text-neutral-800 items-center"
              >
                <span className="col-span-6 font-semibold truncate">{item.name}</span>
                <span className="col-span-2 text-center text-neutral-500 font-mono">
                  x{item.quantity}
                </span>
                <span className="col-span-2 text-right text-neutral-500">
                  {formatINR(item.price)}
                </span>
                <span className="col-span-2 text-right font-bold">{formatINR(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-neutral-800">
                {formatINR(order.pricing.itemsSubtotal)}
              </span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{order.pricing.discountLabel || 'Discount'}</span>
                <span>-{formatINR(order.pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Restaurant GST (5%)</span>
              <span>{formatINR(order.pricing.gst)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>
                {order.pricing.deliveryFee === 0 ? 'FREE' : formatINR(order.pricing.deliveryFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-black text-[#1A1311]">
              <span>TOTAL PAID</span>
              <span className="text-[#FF5E00]">{formatINR(order.pricing.grandTotal)}</span>
            </div>
          </div>

          {/* Eco Thank You Note */}
          <div className="pt-2 text-center text-xs text-neutral-400">
            <p>✨ Thank you for ordering authentic Indian delicacies with CurryCraft!</p>
            <p className="font-mono text-[10px] mt-1 text-neutral-300">
              RECEIPT-VERIFIED-{order.orderId}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print p-6 bg-neutral-50 border-t border-[#E8E5E0] flex flex-col sm:flex-row gap-3">
          <Link
            href={`/portal/track/${order.orderId}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1A1311] text-white font-bold text-sm hover:bg-black transition-colors text-center"
          >
            <Bike className="w-4 h-4 text-[#FF8516]" />
            <span>Track Order Live 🛵</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-700 font-bold text-sm hover:bg-neutral-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF5E00] text-white font-bold text-sm hover:bg-[#e05200] transition-colors shadow-float"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
