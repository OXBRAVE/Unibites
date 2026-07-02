import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./restaurants.module.css";

// Force dynamic fetch
export const revalidate = 0;

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isBanned: false }
  });

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Choose a Restaurant</h1>
      <div className={styles.grid}>
        {restaurants.map((r) => (
          <Link href={`/restaurants/${r.id}`} key={r.id} className={`card ${styles.restaurantCard}`} style={{ borderTop: (r as any).isFlagged ? '5px solid var(--accent)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2>{r.name}</h2>
              {(r as any).isFlagged && <span style={{ background: 'var(--accent)', color: 'white', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>⚠️ FLAGGED</span>}
            </div>
            <p className={styles.description}>{r.description}</p>
            {(r as any).isFlagged && (
              <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Note: {(r as any).flagMessage}
              </p>
            )}
            <div className={styles.cardFooter}>
              <span className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', marginTop: '1rem' }}>View Menu &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
