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

  return null;
}
