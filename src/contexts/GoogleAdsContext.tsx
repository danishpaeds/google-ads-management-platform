"use client";

import googleAdsService, {
  type ClientAccount,
  type ValidationResult,
} from "@/lib/google-ads-api";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface GoogleAdsContextType {
  isConnected: boolean;
  isLoading: boolean;
  accounts: ClientAccount[];
  selectedAccount: string;
  connectionStatus: ValidationResult | null;
  setSelectedAccount: (accountId: string) => void;
  refreshConnection: () => Promise<void>;
  disconnect: () => void;
}

const GoogleAdsContext = createContext<GoogleAdsContextType | undefined>(
  undefined,
);

export function GoogleAdsProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [connectionStatus, setConnectionStatus] =
    useState<ValidationResult | null>(null);

  const refreshConnection = useCallback(async () => {
    try {
      const credentials = googleAdsService.getStoredCredentials();
      if (credentials) {
        const result = await googleAdsService.validateCredentials(credentials);
        setConnectionStatus(result);

        if (result.isValid && result.accounts) {
          setIsConnected(true);
          setAccounts(result.accounts);
          if (result.accounts.length > 0 && !selectedAccount) {
            setSelectedAccount(result.accounts[0].id);
          }
        } else {
          setIsConnected(false);
          setAccounts([]);
          setSelectedAccount("");
        }
      } else {
        setIsConnected(false);
        setAccounts([]);
        setSelectedAccount("");
      }
    } catch (error) {
      console.error("Failed to refresh connection:", error);
      setIsConnected(false);
      setAccounts([]);
      setSelectedAccount("");
    }
  }, [selectedAccount]);

  useEffect(() => {
    const initializeConnection = async () => {
      setIsLoading(true);
      try {
        if (googleAdsService.isAuthenticated()) {
          await refreshConnection();
        }
      } catch (error) {
        console.error("Failed to initialize connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConnection();
  }, [refreshConnection]);

  const disconnect = () => {
    googleAdsService.clearCredentials();
    setIsConnected(false);
    setAccounts([]);
    setSelectedAccount("");
    setConnectionStatus(null);
  };

  const handleSetSelectedAccount = (accountId: string) => {
    setSelectedAccount(accountId);
  };

  const value: GoogleAdsContextType = {
    isConnected,
    isLoading,
    accounts,
    selectedAccount,
    connectionStatus,
    setSelectedAccount: handleSetSelectedAccount,
    refreshConnection,
    disconnect,
  };

  return (
    <GoogleAdsContext.Provider value={value}>
      {children}
    </GoogleAdsContext.Provider>
  );
}

export function useGoogleAds() {
  const context = useContext(GoogleAdsContext);
  if (context === undefined) {
    throw new Error("useGoogleAds must be used within a GoogleAdsProvider");
  }
  return context;
}
