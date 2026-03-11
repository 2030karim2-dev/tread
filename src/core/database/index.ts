// SQLite Database Setup - China Trade Assistant Pro

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'chinatrade.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (db) return db;

    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await initializeDatabase(db);
    return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
    // Enable foreign keys
    await database.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await database.execAsync(`
    -- Trips table
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'planned',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_chinese TEXT,
      category TEXT,
      purchase_price REAL DEFAULT 0,
      sale_price REAL DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      supplier_id TEXT,
      image_url TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    -- Suppliers table
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company_name TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      city TEXT,
      rating REAL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0
    );

    -- Shipments table
    CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      supplier_id TEXT,
      shipment_number TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      departure_port TEXT,
      arrival_port TEXT,
      shipping_company TEXT,
      departure_date TEXT,
      arrival_date TEXT,
      cartons_count INTEGER DEFAULT 0,
      total_weight REAL DEFAULT 0,
      tracking_number TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    -- Expenses table
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'CNY',
      description TEXT,
      date TEXT,
      receipt_image TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id)
    );

    -- Notes table
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT DEFAULT 'text',
      audio_url TEXT,
      image_url TEXT,
      location_lat REAL,
      location_lng REAL,
      location_address TEXT,
      trip_id TEXT,
      supplier_id TEXT,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      is_deleted INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    -- Phrases table (offline phrase book)
    CREATE TABLE IF NOT EXISTS phrases (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      chinese TEXT NOT NULL,
      pinyin TEXT,
      arabic TEXT NOT NULL,
      is_favorite INTEGER DEFAULT 0,
      usage_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Sync queue for offline-first
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      data TEXT,
      timestamp INTEGER NOT NULL,
      retry_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending'
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
    CREATE INDEX IF NOT EXISTS idx_suppliers_city ON suppliers(city);
    CREATE INDEX IF NOT EXISTS idx_shipments_trip ON shipments(trip_id);
    CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
    CREATE INDEX IF NOT EXISTS idx_expenses_trip ON expenses(trip_id);
    CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
    CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
    CREATE INDEX IF NOT EXISTS idx_notes_trip ON notes(trip_id);
    CREATE INDEX IF NOT EXISTS idx_phrases_category ON phrases(category);
    CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_queue(status);
  `);
}

export async function closeDatabase() {
    if (db) {
        await db.closeAsync();
        db = null;
    }
}
