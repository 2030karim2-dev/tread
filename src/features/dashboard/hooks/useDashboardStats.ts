/**
 * Dashboard Stats Hook - خطاف إحصائيات لوحة التحكم
 * يفصل منطق الأعمال عن مكون العرض
 */

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { InventoryItem, Expense } from '@/types';

/**
 * إحصائيات لوحة التحكم
 */
export interface DashboardStats {
    totalPurchases: number;
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    inventoryValue: number;
    profitMargin: number;
    totalTrips: number;
    activeTrips: number;
    completedTrips: number;
    inTransitShipments: number;
    totalProducts: number;
}

/**
 * بيانات الرسوم البيانية
 */
export interface DashboardCharts {
    revenueData: RevenueChartItem[];
    expensesData: ExpenseChartItem[];
}

/**
 * عنصر بيانات الرسم البياني للإيرادات
 */
interface RevenueChartItem {
    name: string;
    purchases: number;
    sales: number;
}

/**
 * عنصر بيانات الرسم البياني للمصروفات
 */
interface ExpenseChartItem {
    name: string;
    value: number;
}

/**
 * Hook للحصول على إحصائيات لوحة التحكم
 * يستخدم useMemo لتحسين الأداء
 */
export function useDashboardStats() {
    const inventory = useAppStore((state) => state.inventory);
    const expenses = useAppStore((state) => state.expenses);
    const trips = useAppStore((state) => state.trips);
    const shipments = useAppStore((state) => state.shipments);

    // حساب الإحصائيات باستخدام useMemo للأداء
    const stats = useMemo((): DashboardStats => {
        const totalPurchases = calculateTotalPurchases(inventory);
        const totalSales = calculateTotalSales(inventory);
        const totalExpenses = calculateTotalExpenses(expenses);
        const netProfit = totalSales - totalPurchases - totalExpenses;
        const inventoryValue = calculateInventoryValue(inventory);
        const profitMargin = totalSales > 0
            ? Math.round((netProfit / totalSales) * 100)
            : 0;

        return {
            totalPurchases,
            totalSales,
            totalExpenses,
            netProfit,
            inventoryValue,
            profitMargin,
            totalTrips: trips.length,
            activeTrips: trips.filter((t) => t.status === 'active').length,
            completedTrips: trips.filter((t) => t.status === 'completed').length,
            inTransitShipments: shipments.filter((s) => s.status === 'in_transit').length,
            totalProducts: inventory.length,
        };
    }, [inventory, expenses, trips, shipments]);

    // حساب بيانات الرسوم البيانية
    const charts = useMemo((): DashboardCharts => {
        const revenueData = calculateRevenueData(inventory);
        const expensesData = calculateExpensesData(expenses);

        return { revenueData, expensesData };
    }, [inventory, expenses]);

    return { stats, charts };
}

/**
 * حساب إجمالي المشتريات
 */
function calculateTotalPurchases(inventory: InventoryItem[]): number {
    return inventory.reduce(
        (sum, item) => sum + item.quantity_purchased * item.purchase_price,
        0
    );
}

/**
 * حساب إجمالي المبيعات
 */
function calculateTotalSales(inventory: InventoryItem[]): number {
    return inventory.reduce(
        (sum, item) => sum + item.quantity_sold * item.sale_price,
        0
    );
}

/**
 * حساب إجمالي المصروفات
 */
function calculateTotalExpenses(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => {
        return sum + convertCurrency(expense.amount, expense.currency as 'CNY' | 'USD' | 'SAR', 'USD');
    }, 0);
}

/**
 * حساب قيمة المخزون
 */
function calculateInventoryValue(inventory: InventoryItem[]): number {
    return inventory.reduce(
        (sum, item) => sum + item.quantity_available * item.sale_price,
        0
    );
}

/**
 * حساب بيانات الرسم البياني للإيرادات
 */
function calculateRevenueData(inventory: InventoryItem[]): RevenueChartItem[] {
    return inventory.map((item) => ({
        name: item.product_name.length > 12
            ? item.product_name.slice(0, 12) + '…'
            : item.product_name,
        purchases: item.quantity_purchased * item.purchase_price,
        sales: item.quantity_sold * item.sale_price,
    }));
}

/**
 * حساب بيانات الرسم البياني للمصروفات
 */
function calculateExpensesData(expenses: Expense[]): ExpenseChartItem[] {
    const expensesByCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
        const category = expense.category;
        const amount = convertCurrency(
            expense.amount,
            expense.currency as 'CNY' | 'USD' | 'SAR',
            'USD'
        );
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    return Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value: Math.round(value),
    }));
}

export default useDashboardStats;
