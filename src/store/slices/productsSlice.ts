/**
 * Products Store Slice - شريحة إدارة المنتجات
 */
import { Product } from '@/types';
import { mockProducts } from '@/data/mock-data';
import { generateId } from '@/lib/id';

export interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

export const initialProductsState: ProductsState = {
    products: mockProducts,
    loading: false,
    error: null,
};

export interface ProductsActions {
    addProduct: (product: Omit<Product, 'id'>) => string;
    updateProduct: (id: string, data: Partial<Product>) => void;
    updateProductField: (id: string, field: string, value: string | number) => void;
    deleteProduct: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setProducts: (products: Product[]) => void;
    clearProducts: () => void;
}

export const createProductsSlice = (set: any) => ({
    ...initialProductsState,
    addProduct: (product: Omit<Product, 'id'>) => {
        const id = generateId();
        set((state: ProductsState) => ({
            products: [...state.products, { ...product, id }],
        }));
        return id;
    },
    updateProduct: (id: string, data: Partial<Product>) => {
        set((state: ProductsState) => ({
            products: state.products.map((product) =>
                product.id === id ? { ...product, ...data } : product
            ),
        }));
    },
    updateProductField: (id: string, field: string, value: string | number) => {
        set((state: ProductsState) => ({
            products: state.products.map((product) =>
                product.id === id ? { ...product, [field]: value } : product
            ),
        }));
    },
    deleteProduct: (id: string) => {
        set((state: ProductsState) => ({
            products: state.products.filter((product) => product.id !== id),
        }));
    },
    setLoading: (loading: boolean) => {
        set({ loading });
    },
    setError: (error: string | null) => {
        set({ error });
    },
    setProducts: (products: Product[]) => {
        set({ products });
    },
    clearProducts: () => {
        set({ products: [] });
    },
});

export type ProductsStore = ProductsState & ProductsActions;
