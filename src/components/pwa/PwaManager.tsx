'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Bell, Share, PlusSquare } from 'lucide-react';
import { toast } from '@/lib/toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {})
        .catch(() => {});
    }

    // Check Notification status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Detect iOS
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      const isStandalone =
        ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone) ||
        window.matchMedia('(display-mode: standalone)').matches;

      setIsIos(isIosDevice && !isStandalone);
    }

    // Listen for beforeinstallprompt on Android/Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install prompt only if not already dismissed this session
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.show('Thank you for installing CurryCraft! Enjoy 1-tap ordering.', 'success');
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.show('Notifications are not supported on this browser.', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.show('Live order alerts enabled! You will be notified on order updates.', 'success');
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification('CurryCraft Alerts Enabled 🍛', {
              body: 'You will receive real-time notifications when your Dum Biryani is simmering and out for delivery!',
              icon: '/images/kolkata-biryani.jpg',
              badge: '/images/kolkata-biryani.jpg'
            });
          });
        }
      } else {
        toast.show('Notification permission was not granted.', 'info');
      }
    } catch {
      toast.show('Unable to request notification permission.', 'error');
    }
  };

  return (
    <>
      {/* Floating PWA Install Prompt for Android & Desktop Chrome */}
      {showInstallBanner && deferredPrompt && (
        <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#1A1311] text-white p-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center text-xl shrink-0 shadow-md">
            🍛
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-bold text-white truncate">Install CurryCraft App</h4>
            <p className="text-[11px] text-neutral-300 leading-tight">
              1-tap reordering, faster delivery tracking & offline access
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 min-h-[38px] rounded-xl bg-[#FF5E00] hover:bg-[#e05200] text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} />
              <span>Install</span>
            </button>
            <button
              onClick={dismissBanner}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-white rounded-xl transition cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari "Add to Home Screen" Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E5E0] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5E00]/10 text-[#FF5E00] mx-auto flex items-center justify-center text-2xl font-bold">
              🍛
            </div>
            <div>
              <h3 className="text-base font-outfit font-black text-neutral-900">
                Install CurryCraft on iOS
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Enjoy full-screen royal dining with instant 1-tap launch
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-left bg-[#FFFDF9] p-4 rounded-2xl border border-[#E8E5E0]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF5E00] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <p className="text-neutral-700 flex items-center gap-1">
                  Tap the <Share size={14} className="text-[#FF5E00] inline" /> <strong>Share</strong> button in Safari toolbar
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF5E00] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <p className="text-neutral-700 flex items-center gap-1">
                  Scroll down and tap <PlusSquare size={14} className="text-[#FF5E00] inline" /> <strong>Add to Home Screen</strong>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF5E00] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <p className="text-neutral-700">
                  Tap <strong>Add</strong> in the top right corner
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#1A1311] text-white text-xs font-bold hover:bg-black transition cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
