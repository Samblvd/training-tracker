"use client";

import { useEffect } from "react";

import { useTrainingStore } from "@/store/training-store";

export function AppBootstrap() {
  useEffect(() => {
    const finishHydration = () => {
      const store = useTrainingStore.getState();
      store.markHydrated(true);
      store.initializeFromLegacy();
    };

    if (useTrainingStore.persist.hasHydrated()) {
      finishHydration();
    }

    const unsubscribe = useTrainingStore.persist.onFinishHydration(() => {
      finishHydration();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        if (process.env.NODE_ENV !== "production") {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
          if ("caches" in window) {
            const keys = await window.caches.keys();
            await Promise.all(keys.map((key) => window.caches.delete(key)));
          }
          return;
        }

        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        console.error("PWA service worker registration failed", error);
      }
    };

    void register();
  }, []);

  return null;
}
