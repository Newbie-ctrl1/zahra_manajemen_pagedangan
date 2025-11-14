"use client";

import { WarungProvider } from "./context/WarungContext";

export default function WarungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WarungProvider>{children}</WarungProvider>;
}
