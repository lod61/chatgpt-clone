import { useState, useCallback, useEffect } from "react";
import { validateApiKey as validateApiKeyRequest } from "@/services/api";

const API_KEY_STORAGE_KEY = "chat_api_key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    // 从 localStorage 读取存储的 API key
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    return storedKey || null;
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // 当 apiKey 变化时，保存到 localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, [apiKey]);

  const validateApiKey = useCallback(async (key: string) => {
    setIsValidating(true);
    setError(null);
    
    try {
      await validateApiKeyRequest(key);
      setApiKey(key);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to validate API key. Please try again.";
      setError(errorMessage);
      setApiKey(null);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKey(null);
    setError(null);
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }, []);

  return {
    apiKey,
    error,
    isValidating,
    validateApiKey,
    clearApiKey,
  };
} 