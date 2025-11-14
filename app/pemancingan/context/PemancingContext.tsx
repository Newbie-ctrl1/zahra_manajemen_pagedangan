"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  type: string;
  stock: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: {
    packageId: number;
    packageName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

interface PemancingContextType {
  packages: Package[];
  transactions: Transaction[];
  addPackage: (pkg: Omit<Package, "id">) => void;
  updatePackage: (id: number, pkg: Partial<Package>) => void;
  deletePackage: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  updateStock: (packageId: number, quantity: number) => void;
}

const PemancingContext = createContext<PemancingContextType | undefined>(undefined);

const initialPackages: Package[] = [
  { id: 1, name: "Paket Harian Biasa", price: 30000, duration: "1 Hari", type: "Harian", stock: 50 },
  { id: 2, name: "Paket Harian VIP", price: 50000, duration: "1 Hari", type: "Harian", stock: 30 },
  { id: 3, name: "Paket 3 Jam", price: 25000, duration: "3 Jam", type: "Jam", stock: 40 },
  { id: 4, name: "Paket 5 Jam", price: 40000, duration: "5 Jam", type: "Jam", stock: 40 },
  { id: 5, name: "Paket Malam", price: 35000, duration: "Malam", type: "Spesial", stock: 25 },
  { id: 6, name: "Umpan Standar", price: 5000, duration: "-", type: "Umpan", stock: 100 },
  { id: 7, name: "Umpan Premium", price: 10000, duration: "-", type: "Umpan", stock: 80 },
  { id: 8, name: "Kail Kecil", price: 15000, duration: "-", type: "Alat", stock: 60 },
  { id: 9, name: "Kail Besar", price: 25000, duration: "-", type: "Alat", stock: 40 },
  { id: 10, name: "Sewa Jaring", price: 20000, duration: "-", type: "Alat", stock: 30 },
];

export function PemancingProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedPackages = localStorage.getItem("pemancingan_packages");
    const savedTransactions = localStorage.getItem("pemancingan_transactions");
    
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    } else {
      setPackages(initialPackages);
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save packages to localStorage
  useEffect(() => {
    if (packages.length > 0) {
      localStorage.setItem("pemancingan_packages", JSON.stringify(packages));
    }
  }, [packages]);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("pemancingan_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const addPackage = (pkg: Omit<Package, "id">) => {
    const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    setPackages([...packages, { ...pkg, id: newId }]);
  };

  const updatePackage = (id: number, updatedPackage: Partial<Package>) => {
    setPackages(packages.map(p => p.id === id ? { ...p, ...updatedPackage } : p));
  };

  const deletePackage = (id: number) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `PMC-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update stock
    transaction.items.forEach(item => {
      updateStock(item.packageId, -item.quantity);
    });
  };

  const updateStock = (packageId: number, quantity: number) => {
    setPackages(packages.map(p => 
      p.id === packageId ? { ...p, stock: p.stock + quantity } : p
    ));
  };

  return (
    <PemancingContext.Provider value={{
      packages,
      transactions,
      addPackage,
      updatePackage,
      deletePackage,
      addTransaction,
      updateStock,
    }}>
      {children}
    </PemancingContext.Provider>
  );
}

export function usePemancingan() {
  const context = useContext(PemancingContext);
  if (context === undefined) {
    throw new Error("usePemancingan must be used within a PemancingProvider");
  }
  return context;
}
