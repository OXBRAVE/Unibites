"use client";
import { useState } from "react";

export default function MenuManager({ restaurantId, initialMenu }: { restaurantId: string; initialMenu: any[] }) {
  const [menu, setMenu] = useState(initialMenu);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", isAvailable: true });

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", isAvailable: true });
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingItem ? `/api/admin/menu/${editingItem.id}` : `/api/admin/menu`;
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, price: parseFloat(formData.price), restaurantId })
    });

    if (res.ok) {
      const savedItem = await res.json();
      if (editingItem) {
        setMenu(menu.map(i => i.id === savedItem.id ? savedItem : i));
      } else {
        setMenu([...menu, savedItem]);
      }
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      setMenu(menu.filter(i => i.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Menu</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add Item</button>
      </div>

      {(isAdding || editingItem) && (
        <form onSubmit={handleSave} className="card animate-fade-in" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: '1rem' }}>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea required className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Price</label>
            <input type="number" step="0.01" required className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="avail" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} style={{ width: '18px', height: '18px' }} />
            <label htmlFor="avail" className="input-label" style={{ marginBottom: 0 }}>Is Available</label>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">Save Item</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {menu.map(item => (
          <div key={item.id} className="card animate-fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ marginBottom: "0.2rem" }}>{item.name}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>{item.description}</p>
              <p style={{ fontWeight: 600, marginTop: "0.5rem" }}>₦{item.price.toFixed(2)} {item.isAvailable ? '' : <span style={{ color: 'var(--accent)', marginLeft: '1rem', fontSize: '0.85rem' }}>(Unavailable)</span>}</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => {
                setEditingItem(item);
                setFormData({ name: item.name, description: item.description, price: item.price.toString(), isAvailable: item.isAvailable });
                setIsAdding(false);
              }}>Edit</button>
              <button className="btn btn-secondary" style={{ color: "var(--accent)" }} onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
        {menu.length === 0 && <p>No items on the menu yet.</p>}
      </div>
    </div>
  );
}
