import { generateId } from '@/lib/helpers';
import { StateCreator } from 'zustand';

export interface BuyingItem {
  id: string;
  product_name: string;
  oem_number: string;
  target_quantity: number;
  bought_quantity: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'searching' | 'bought' | 'cancelled';
  notes: string;
  trip_id: string;
  customer_name?: string;
}

export interface BuyingListSlice {
  buyingList: BuyingItem[];
  addBuyingItem: (item: Omit<BuyingItem, 'id'>) => void;
  updateBuyingItem: (id: string, data: Partial<BuyingItem>) => void;
  deleteBuyingItem: (id: string) => void;
}

export const createBuyingListSlice: StateCreator<BuyingListSlice> = (set) => ({
  buyingList: [],
  addBuyingItem: (item) =>
    set((state) => ({ buyingList: [{ ...item, id: generateId() }, ...state.buyingList] })),
  updateBuyingItem: (id, data) =>
    set((state) => ({ buyingList: state.buyingList.map((i) => (i.id === id ? { ...i, ...data } : i)) })),
  deleteBuyingItem: (id) =>
    set((state) => ({ buyingList: state.buyingList.filter((i) => i.id !== id) })),
});
