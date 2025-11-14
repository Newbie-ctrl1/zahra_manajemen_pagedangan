"use client";

import { useState } from "react";
import Link from "next/link";
import { useWarung } from "../context/WarungContext";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  stock: number;
}

export default function KasirPage() {
  const { products, addTransaction } = useWarung();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Makanan", "Minuman", "Snack"];

  const filteredProducts = selectedCategory === "Semua" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: typeof products[0]) => {
    if (product.stock === 0) {
      alert(`${product.name} stok habis!`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Stok ${product.name} tidak mencukupi!`);
        return;
      }
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        stock: product.stock
      }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.productId !== productId));
    }
  };

  const deleteFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    
    const total = calculateTotal();
    const confirmation = confirm(
      `Total: Rp ${total.toLocaleString("id-ID")}\n\nKonfirmasi pembayaran?`
    );
    
    if (confirmation) {
      addTransaction({
        items: cart,
        total: total
      });
      
      alert("Transaksi berhasil! Terima kasih.");
      setCart([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-orange-500 dark:bg-orange-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/warung" className="hover:opacity-80">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Kasir Warung</h1>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Zahra Pagedangan</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow ${
                    product.stock > 0 ? 'cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => addToCart(product)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mt-2 text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-orange-600 dark:text-orange-400 font-bold text-xl mt-2">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Keranjang Belanja
              </h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Keranjang kosong
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.productId} className="border-b dark:border-gray-700 pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-white">
                              {item.productName}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Rp {item.price.toLocaleString("id-ID")} / item
                            </p>
                          </div>
                          <button
                            onClick={() => deleteFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                const product = products.find(p => p.id === item.productId);
                                if (product) addToCart(product);
                              }}
                              className="w-7 h-7 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold text-orange-600 dark:text-orange-400">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4 mb-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-800 dark:text-white">Total:</span>
                      <span className="text-orange-600 dark:text-orange-400">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
