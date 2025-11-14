"use client";

import { PemancingProvider } from "./context/PemancingContext";

export default function PemancingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PemancingProvider>{children}</PemancingProvider>;
}
