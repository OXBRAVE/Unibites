import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import styles from "./menu.module.css";
import Link from "next/link";
import FeedbackForm from "@/app/history/FeedbackForm";

export default async function RestaurantMenuPage({ params }: { params: { id: string } }) {
  // Wait for params as it is a Promise in recent Next.js versions for dynamic segments
  const resolvedParams = await Promise.resolve(params);

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: resolvedParams.id },
    include: { menuItems: true },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <Link href="/restaurants" className={styles.backLink}>&larr; Back to Restaurants</Link>
        <h1>{restaurant.name} Menu</h1>
        <p className={styles.description}>{restaurant.description}</p>
      </div>

      <div className={styles.menuGrid}>
        {restaurant.menuItems.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1", color: "var(--text-secondary)" }}>
            No items available right now. Mhmm maybe they should add some.
          </p>
        ) : (
          restaurant.menuItems.map((item) => (
            <div key={item.id} className={`card ${styles.menuCard}`}>
              <div className={styles.imageWrapper}>
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill 
                    style={{ objectFit: "cover" }}
                    className={styles.foodImage} 
                  />
                ) : (
                  <div className={styles.foodImage} style={{ background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🍽️
                  </div>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.menuInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                </div>
                <div className={styles.priceAndAction}>
                  <div className={styles.priceTag}>₦{item.price.toFixed(2)}</div>
                  <div className={styles.actionArea}>
                    {item.isAvailable ? (
                      <AddToCartButton 
                        item={{ 
                          id: item.id, 
                          name: item.name, 
                          price: item.price, 
                          quantity: 1, 
                          restaurantId: restaurant.id, 
                          restaurantName: restaurant.name 
                        }} 
                      />
                    ) : (
                      <span className={styles.unavailable}>Out of stock</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ marginTop: '3rem', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Feedback</h2>
        <FeedbackForm restaurantId={restaurant.id} restaurantName={restaurant.name} />
      </div>
    </div>
  );
}
