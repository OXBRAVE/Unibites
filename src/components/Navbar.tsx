"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { items } = useCart();
  
  const totalItems = items.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <header className={`${styles.header} glass`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Uni<span className={styles.logoHighlight}>Bites</span>
        </Link>
        <nav className={styles.navLinks}>
          {status === "loading" ? null : session ? (
            <>
              {session.user.role === "SUPERADMIN" ? (
                <Link href="/superadmin" className={styles.navLink}>
                  Super Admin Dashboard
                </Link>
              ) : session.user.role === "ADMIN" ? (
                <Link href="/admin" className={styles.navLink}>
                  Admin Dashboard ({session.user.restaurantName})
                </Link>
              ) : (
                <>
                  <Link href="/restaurants" className={styles.navLink}>Restaurants</Link>
                  <Link href="/history" className={styles.navLink}>Order History</Link>
                  <Link href="/cart" className={styles.cartLink}>
                    🛒 Cart {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
                  </Link>
                </>
              )}
              <div className={styles.userMenu}>
                <span className={styles.welcomeText}>Hi, {session.user.name?.split(' ')[0]}</span>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-secondary" style={{ padding: "0.4rem 1rem" }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" style={{ marginRight: '1rem', padding: "0.4rem 1rem" }}>Login</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: "0.4rem 1rem" }}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
