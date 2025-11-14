"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

interface WarungContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  updateStock: (productId: number, quantity: number) => void;
}

const WarungContext = createContext<WarungContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: 1, name: "Nasi Goreng", price: 15000, category: "Makanan", stock: 50 },
  { id: 2, name: "Mie Goreng", price: 12000, category: "Makanan", stock: 45 },
  { id: 3, name: "Nasi Putih", price: 5000, category: "Makanan", stock: 100 },
  { id: 4, name: "Ayam Goreng", price: 20000, category: "Makanan", stock: 30 },
  { id: 5, name: "Teh Manis", price: 5000, category: "Minuman", stock: 80 },
  { id: 6, name: "Es Jeruk", price: 7000, category: "Minuman", stock: 60 },
  { id: 7, name: "Kopi", price: 8000, category: "Minuman", stock: 70 },
  { id: 8, name: "Air Mineral", price: 3000, category: "Minuman", stock: 120 },
  { id: 9, name: "Kerupuk", price: 2000, category: "Snack", stock: 90 },
  { id: 10, name: "Gorengan", price: 1000, category: "Snack", stock: 100 },
];

export function WarungProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("warung_products");
    const savedTransactions = localStorage.getItem("warung_transactions");
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("warung_products", JSON.stringify(products));
    }
  }, [products]);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("warung_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update stock
    transaction.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
  };

  const updateStock = (productId: number, quantity: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: p.stock + quantity } : p
    ));
  };

  return (
    <WarungContext.Provider value={{
      products,
      transactions,
      addProduct,
      updateProduct,
      deleteProduct,
      addTransaction,
      updateStock,
    }}>
      {children}
    </WarungContext.Provider>
  );
}

export function useWarung() {
  const context = useContext(WarungContext);
  if (context === undefined) {
    throw new Error("useWarung must be used within a WarungProvider");
  }
  return context;
}
