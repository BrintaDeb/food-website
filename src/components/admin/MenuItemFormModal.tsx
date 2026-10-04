'use client';

import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  prepTime: z.string().min(2, 'Preparation time is required (e.g., 20 mins)'),
  isVeg: z.boolean().default(false),
  spiceLevel: z.coerce.number().min(1).max(3).default(1),
  tagsInput: z.string().min(1, 'Enter at least one keyword tag (e.g., aloo, egg, fragrant)'),
  image: z.string().optional().default('/images/kolkata-biryani.jpg'),
  inStock: z.boolean().default(true)
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<MenuItem>) => Promise<void>;
  initialData?: MenuItem | null;
  isSubmitting?: boolean;
}

export function MenuItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false
}: MenuItemFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema) as unknown as Resolver<MenuItemFormData>,
    defaultValues: {
      name: '',
      category: 'Biryani',
      price: 250,
      description: '',
      prepTime: '20 mins',
      isVeg: false,
      spiceLevel: 1,
      tagsInput: '',
      image: '/images/kolkata-biryani.jpg',
      inStock: true
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        description: initialData.description || '',
        prepTime: initialData.prepTime || '20 mins',
        isVeg: !!initialData.isVeg,
        spiceLevel: initialData.spiceLevel || 1,
        tagsInput: (initialData.tags || []).join(', '),
        image: initialData.image || '/images/kolkata-biryani.jpg',
        inStock: initialData.inStock ?? true
      });
    } else {
      reset({
        name: '',
        category: 'Biryani',
        price: 250,
        description: '',
        prepTime: '20 mins',
        isVeg: false,
        spiceLevel: 1,
        tagsInput: '',
        image: '/images/kolkata-biryani.jpg',
        inStock: true
      });
    }
  }, [initialData, reset, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: MenuItemFormData) => {
    const tags = data.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    await onSubmit({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      prepTime: data.prepTime,
      isVeg: data.isVeg,
      spiceLevel: data.spiceLevel as 1 | 2 | 3,
      tags,
      image: data.image || '/images/kolkata-biryani.jpg',
      inStock: data.inStock
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(0rem,env(safe-area-inset-bottom,0px))]">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto touch-scroll shadow-2xl border border-stone-200 p-5 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-stone-400 hover:text-stone-700 p-2.5 rounded-full hover:bg-stone-100 transition min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-tight">
              {initialData ? 'Edit Indian Cuisine Dish' : 'Add New Culinary Masterpiece'}
            </h2>
            <p className="text-xs text-stone-500">
              Configure dish metadata, authentic tags, pricing, and dietary classification
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Dish Name *
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Kolkata Chicken Biryani"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
              >
                <option value="Biryani">Biryani</option>
                <option value="Curries">Curries</option>
                <option value="Breads">Breads</option>
                <option value="Desserts & Beverages">Desserts & Beverages</option>
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="10"
                {...register('price')}
                placeholder="380"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Prep Time *
              </label>
              <input
                {...register('prepTime')}
                placeholder="25 mins"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {errors.prepTime && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.prepTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Spice Level
              </label>
              <select
                {...register('spiceLevel')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
              >
                <option value={1}>Mild 🌶️</option>
                <option value={2}>Medium 🌶️🌶️</option>
                <option value={3}>Fiery 🌶️🌶️🌶️</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Fragrant aged long-grain basmati rice slow-cooked in dum with tender spiced chicken, melt-in-the-mouth golden aloo, and boiled egg..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Keyword Tags (Comma-separated) *
            </label>
            <input
              {...register('tagsInput')}
              placeholder="aloo, egg, fragrant, biryani, comfort, lentil"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Example: for Kolkata Biryani: &apos;aloo, egg, fragrant, dum&apos;; for Dal Sambar:
              &apos;comfort, vegetarian, lentil&apos;
            </p>
            {errors.tagsInput && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.tagsInput.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('isVeg')}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-stone-700">🌱 100% Pure Vegetarian</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('inStock')}
                className="w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-stone-700">
                ✅ Available in Kitchen Stock
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial min-h-[48px] px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5E00] to-[#E04800] hover:from-[#FF7324] hover:to-[#EB5505] text-white font-bold text-sm shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : initialData ? (
                'Save Changes'
              ) : (
                'Add Dish to Menu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
