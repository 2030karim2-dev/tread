import type { StateCreator } from 'zustand';
import type { Product } from '@/types';
import { mockProducts } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

export interface ProductsSlice {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductField: (id: string, field: string, value: string | number) => void;
  deleteProduct: (id: string) => void;
}

export const createProductsSlice: StateCreator<ProductsSlice> = (set) => ({
  products: mockProducts,
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, { ...product, id: generateId() }] })),
  updateProductField: (id, field, value) =>
    set((state) => ({ products: state.products.map((p) => (p.id === id ? { ...p, [field]: value } : p)) })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
});
