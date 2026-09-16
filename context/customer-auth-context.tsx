"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

interface CustomerAuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  register: (input: { name: string; email?: string; phone?: string; password: string }) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

async function customerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
  return data as T;
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    customerFetch<{ customer: Customer }>("/api/customers/auth/me")
      .then((data) => setCustomer(data.customer))
      .catch(() => setCustomer(null))
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(async (input: { name: string; email?: string; phone?: string; password: string }) => {
    const data = await customerFetch<{ customer: Customer }>("/api/customers/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setCustomer(data.customer);
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await customerFetch<{ customer: Customer }>("/api/customers/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    setCustomer(data.customer);
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const data = await customerFetch<{ customer: Customer }>("/api/customers/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    setCustomer(data.customer);
  }, []);

  const logout = useCallback(async () => {
    await customerFetch("/api/customers/auth/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, isLoading, register, login, loginWithGoogle, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
