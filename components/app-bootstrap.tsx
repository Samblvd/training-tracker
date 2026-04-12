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
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (error) {
        console.error("PWA service worker registration failed", error);
      }
    };

    void register();
  }, []);

  return null;
}
