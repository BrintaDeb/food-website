'use client';

import React, { useState, useMemo } from 'react';
import type { MenuItem } from '@/types/menu';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Flame,
  Leaf,
  Clock,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { MenuItemFormModal } from './MenuItemFormModal';

interface MenuDataTableProps {
  initialItems: MenuItem[];
  onRefresh?: () => void;
}

export function MenuDataTable({ initialItems }: MenuDataTableProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<'price' | 'name' | 'prepTime'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

        const term = searchTerm.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.tags?.some((t) => t.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'price') {
          cmp = a.price - b.price;
        } else if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else {
          cmp = a.prepTime.localeCompare(b.prepTime);
        }
        return sortAsc ? cmp : -cmp;
      });
  }, [items, searchTerm, selectedCategory, sortField, sortAsc]);

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStock })
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, inStock: !currentStock } : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle stock', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleSaveItem = async (dishData: Partial<MenuItem>) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData)
        });

        if (res.ok) {
          const updated = await res.json();
          setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
          setIsModalOpen(false);
          setEditingItem(null);
        }
      } else {
        // Create new
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData)
        });

        if (res.ok) {
          const created = await res.json();
          setItems((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save menu item', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSort = (field: 'price' | 'name' | 'prepTime') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action & filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#1A1311] text-white shadow'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes or tags (e.g. aloo, egg)..."
              className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-orange-500 focus:bg-white transition"
            />
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5E00] to-[#E04800] hover:from-[#FF7324] hover:to-[#EB5505] text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} /> Add New Dish
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              <tr>
                <th className="py-3.5 px-6">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1.5 hover:text-stone-800 transition"
                  >
                    Culinary Dish
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-1.5 hover:text-stone-800 transition"
                  >
                    Price
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="py-3.5 px-6">Prep Time</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No Indian cuisine items match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {item.isVeg ? (
                            <span
                              title="Vegetarian"
                              className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-100 text-emerald-700"
                            >
                              <Leaf size={12} />
                            </span>
                          ) : (
                            <span
                              title="Non-Vegetarian"
                              className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-red-100 text-red-700 font-black text-[10px]"
                            >
                              🍗
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            {item.name}
                            {item.spiceLevel && (
                              <span
                                title={`Spice Level: ${item.spiceLevel}/3`}
                                className="text-orange-500 inline-flex"
                              >
                                {Array.from({ length: item.spiceLevel }).map((_, i) => (
                                  <Flame key={i} size={11} className="fill-orange-500" />
                                ))}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 line-clamp-1 max-w-sm mt-0.5">
                            {item.description}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.tags.map((t) => (
                                <span
                                  key={t}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
                                >
                                  <Tag size={9} className="text-stone-400" />
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-stone-700">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-semibold">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-stone-900 text-sm">₹{item.price}</td>

                    <td className="py-4 px-6 text-stone-600">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <Clock size={13} className="text-stone-400" />
                        {item.prepTime}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStock(item.id, item.inStock)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                          item.inStock
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {item.inStock ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            In Stock
                          </>
                        ) : (
                          <>
                            <XCircle size={13} className="text-stone-400" />
                            Sold Out
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                          title="Edit Dish"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Dish"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Form Modal */}
      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveItem}
        initialData={editingItem}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">Delete Menu Item?</h3>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure you want to remove &ldquo;{itemToDelete.name}&rdquo; from the live Indian
              cuisine menu? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(itemToDelete.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
