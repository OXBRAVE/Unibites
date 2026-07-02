"use client";
import { useState } from "react";
import OrderList from "./OrderList";
import MenuManager from "./MenuManager";
import AnalyticsView from "./AnalyticsView";
import styles from "./admin.module.css";

interface RestaurantWithRelations {
  id: string;
  name: string;
  orders: any[];
  menuItems: any[];
  feedbacks: any[];
}

export default function AdminDashboard({ restaurant }: { restaurant: RestaurantWithRelations }) {
  const [activeTab, setActiveTab] = useState("ORDERS");

  return (
    <div>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'ORDERS' ? styles.active : ''}`} onClick={() => setActiveTab('ORDERS')}>Orders</button>
        <button className={`${styles.tab} ${activeTab === 'MENU' ? styles.active : ''}`} onClick={() => setActiveTab('MENU')}>Menu</button>
        <button className={`${styles.tab} ${activeTab === 'ANALYTICS' ? styles.active : ''}`} onClick={() => setActiveTab('ANALYTICS')}>Analytics & Feedback</button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'ORDERS' && <OrderList initialOrders={restaurant.orders} />}
        {activeTab === 'MENU' && <MenuManager restaurantId={restaurant.id} initialMenu={restaurant.menuItems} />}
        {activeTab === 'ANALYTICS' && <AnalyticsView feedbacks={restaurant.feedbacks} orders={restaurant.orders} />}
      </div>
    </div>
  );
}
