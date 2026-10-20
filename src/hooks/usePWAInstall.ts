import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    gtecDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.gtecDeferredPrompt) {
      return window.gtecDeferredPrompt;
    }
    return null;
  });

  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // 1. Detect standalone / installed state across Android, iOS Safari, Chrome Desktop, Edge
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // 2. Accurate Mobile / OS Detection
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1); // iPadOS 13+
    const isAndroidDevice = /android/.test(userAgent);
    const isMobileDevice = isIOSDevice || isAndroidDevice || /mobile|tablet/.test(userAgent) || window.innerWidth < 768;

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);
    setIsDesktop(!isMobileDevice);

    // 3. Check if early script already caught the prompt
    if (window.gtecDeferredPrompt) {
      setDeferredPrompt(window.gtecDeferredPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.gtecDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleEarlyPromptEvent = () => {
      if (window.gtecDeferredPrompt) {
        setDeferredPrompt(window.gtecDeferredPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.gtecDeferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('gtec-pwa-installable', handleEarlyPromptEvent);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('gtec-pwa-installable', handleEarlyPromptEvent);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Direct programmatic trigger
  const install = useCallback(async (): Promise<boolean> => {
    const promptToUse = deferredPrompt || (typeof window !== 'undefined' ? window.gtecDeferredPrompt : null);
    if (!promptToUse) return false;

    try {
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') window.gtecDeferredPrompt = null;
        return true;
      }
    } catch (err) {
      console.warn('PWA prompt invocation error:', err);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!(deferredPrompt || (typeof window !== 'undefined' && window.gtecDeferredPrompt)),
    isInstalled,
    isMobile,
    isIOS,
    isAndroid,
    isDesktop,
    install,
    deferredPrompt: deferredPrompt || (typeof window !== 'undefined' ? window.gtecDeferredPrompt : null),
  };
}
