"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useTrainingStore } from "@/store/training-store";

export function AppBootstrap() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useTrainingStore((state) => state.hydrated);
  const workout = useTrainingStore((state) => state.workout);
  const resumeWorkoutState = useTrainingStore((state) => state.resumeWorkoutState);

  useEffect(() => {
    const finishHydration = () => {
      const store = useTrainingStore.getState();
      store.markHydrated(true);
      store.initializeFromLegacy();
      store.resumeWorkoutState();
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
    if (!hydrated) return;

    const handleResume = () => {
      if (document.visibilityState === "hidden") return;
      resumeWorkoutState();
    };

    handleResume();
    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
  }, [hydrated, resumeWorkoutState]);

  useEffect(() => {
    if (!hydrated || !workout || workout.finishedAt) return;
    if (pathname === "/" || pathname === "/planner") {
      router.replace("/workout");
    }
  }, [hydrated, pathname, router, workout]);

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
