import { useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";

interface ShakeConfig {
  threshold?: number;
  interval?: number;
}

export function useShakeDetector(
  onShake: () => void,
  active: boolean,
  config?: ShakeConfig,
) {
  const { threshold = 1.8, interval = 100 } = config || {};

  useEffect(() => {
    let subscription: any;

    if (active) {
      Accelerometer.setUpdateInterval(interval);

      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Cálculo da força G total
        const force = Math.sqrt(x * x + y * y + z * z);

        if (force > threshold) {
          onShake();
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [active, threshold, interval, onShake]);
}
