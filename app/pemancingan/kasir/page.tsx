"use client";

import { useState } from "react";
import Link from "next/link";
import { usePemancingan, Package } from "../context/PemancingContext";

export default function KasirPemancingPage() {
  const { packages, addTransaction } = usePemancingan();
  const [selectedType, setSelectedType] = useState<string>("Semua");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const types = ["Semua", "Harian", "Jam", "Spesial", "Umpan", "Alat"];

  const filteredPackages = selectedType === "Semua" 
    ? packages 
    : packages.filter(p => p.type === selectedType);

  const handlePackageClick = (pkg: Package) => {
    if (pkg.stock === 0) {
      alert(`${pkg.name} stok habis!`);
      return;
    }
    setSelectedPackage(pkg);
    setOrderQuantity(1);
    setShowCheckoutModal(true);
  };

  const handleQuantityChange = (change: number) => {
    if (!selectedPackage) return;
    
    const newQuantity = orderQuantity + change;
    if (newQuantity < 1) return;
    if (newQuantity > selectedPackage.stock) {
      alert(`Stok ${selectedPackage.name} hanya tersedia ${selectedPackage.stock}`);
      return;
    }
    setOrderQuantity(newQuantity);
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    return selectedPackage.price * orderQuantity;
  };

  const handleCheckout = () => {
    if (!selectedPackage) return;
    
    const total = calculateTotal();
    const confirmation = confirm(
      `Checkout:\n${selectedPackage.name} x ${orderQuantity}\nTotal: Rp ${total.toLocaleString("id-ID")}\n\nKonfirmasi pembayaran?`
    );
    
    if (confirmation) {
      addTransaction({
        items: [{
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          quantity: orderQuantity,
          price: selectedPackage.price
        }],
        total: total
      });
      
      alert("Transaksi berhasil! Selamat memancing!");
      setShowCheckoutModal(false);
      setSelectedPackage(null);
      setOrderQuantity(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-blue-500 dark:bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pemancingan" className="hover:opacity-80">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Kasir Pemancingan</h1>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Zahra Pagedangan</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Packages Section */}
          <div className="lg:col-span-2">
            {/* Type Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedType === type
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Packages Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow ${
                    pkg.stock > 0 ? 'cursor-pointer' : 'opacity-60'
                  }`}
                  onClick={() => handlePackageClick(pkg)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {pkg.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          pkg.stock > 10 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : pkg.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          Stock: {pkg.stock}
                        </span>
                      </div>
                      {pkg.duration !== "-" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {pkg.duration}
                        </p>
                      )}
                      <h3 className="font-bold text-lg mt-1 text-gray-800 dark:text-white">
                        {pkg.name}
                      </h3>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-2">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Informasi
              </h2>
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Klik paket untuk melakukan checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Checkout
              </h3>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedPackage(null);
                  setOrderQuantity(1);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {selectedPackage.name}
                    </h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {selectedPackage.type}
                      </span>
                      {selectedPackage.duration !== "-" && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {selectedPackage.duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    Rp {selectedPackage.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Stok tersedia: {selectedPackage.stock}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jumlah
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold dark:text-white min-w-[60px] text-center">
                    {orderQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Harga satuan:</span>
                  <span className="font-medium dark:text-white">
                    Rp {selectedPackage.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Jumlah:</span>
                  <span className="font-medium dark:text-white">{orderQuantity}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Rp {calculateTotal().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
