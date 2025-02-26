// hooks/usePolling.ts
import { useEffect } from "react";
import { useCrypto } from "./useCryptoApi";

export const usePolling = (interval = 30000) => {
  const { cryptos, loading, error } = useCrypto();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!loading) {
        useCrypto(); // Refetch data only if not already loading
      }
    }, interval);

    return () => clearInterval(timer);
  }, [loading]); // Runs every X seconds

  return { cryptos, loading, error };
};
