// Database Types - China Trade Assistant Pro

export type TripStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Trip {
    id: string;
    name: string;
    city: string;
    start_date: string;
    end_date: string;
    status: TripStatus;
    notes: string;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Product {
    id: string;
    name: string;
    name_chinese: string;
    category: string;
    purchase_price: number;
    sale_price: number;
    quantity: number;
    supplier_id: string | null;
    image_url: string | null;
    notes: string;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Supplier {
    id: string;
    name: string;
    company_name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    rating: number;
    notes: string;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Shipment {
    id: string;
    trip_id: string | null;
    supplier_id: string | null;
    shipment_number: string;
    status: ShipmentStatus;
    departure_port: string;
    arrival_port: string;
    shipping_company: string;
    departure_date: string;
    arrival_date: string | null;
    cartons_count: number;
    total_weight: number;
    tracking_number: string | null;
    notes: string;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Expense {
    id: string;
    trip_id: string | null;
    category: string;
    amount: number;
    currency: 'CNY' | 'USD' | 'SAR';
    description: string;
    date: string;
    receipt_image: string | null;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    type: 'text' | 'voice' | 'image';
    audio_url: string | null;
    image_url: string | null;
    location_lat: number | null;
    location_lng: number | null;
    location_address: string | null;
    trip_id: string | null;
    supplier_id: string | null;
    tags: string;
    created_at: string;
    updated_at: string;
    synced_at: string | null;
    is_deleted: number;
}

export interface Phrase {
    id: string;
    category: string;
    chinese: string;
    pinyin: string;
    arabic: string;
    is_favorite: number;
    usage_count: number;
    created_at: string;
    updated_at: string;
}

export interface SyncQueueItem {
    id: string;
    table_name: string;
    record_id: string;
    operation: 'create' | 'update' | 'delete';
    data: string;
    timestamp: number;
    retry_count: number;
    status: 'pending' | 'syncing' | 'failed';
}

// Database table names
export const TABLES = {
    TRIPS: 'trips',
    PRODUCTS: 'products',
    SUPPLIERS: 'suppliers',
    SHIPMENTS: 'shipments',
    EXPENSES: 'expenses',
    NOTES: 'notes',
    PHRASES: 'phrases',
    SYNC_QUEUE: 'sync_queue',
} as const;
