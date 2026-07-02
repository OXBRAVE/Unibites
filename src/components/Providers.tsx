"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./CartProvider";

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
};
