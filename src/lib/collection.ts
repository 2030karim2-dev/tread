/**
 * Collection Utilities - دوال مساعدة للتعامل مع المصفوفات
 * مطبقة مبدأ DRY (Don't Repeat Yourself)
 */

/**
 * استخراج القيم الفريدة من مصفوفة حسب مفتاح معين
 * @example
 * const suppliers = [{category: 'A'}, {category: 'B'}, {category: 'A'}]
 * uniqueBy(suppliers, 'category') // ['A', 'B']
 */
export function uniqueBy<T, K extends keyof T>(array: T[], key: K): T[K][] {
    return [...new Set(array.map(item => item[key]))];
}

/**
 * استخراج القيم الفريدة مع الحفاظ على الترتيب
 * @example
 * const arr = [1, 2, 1, 3, 2]
 * uniqueValues(arr) // [1, 2, 3]
 */
export function uniqueValues<T>(array: T[]): T[] {
    return [...new Set(array)];
}

/**
 * تجميع عناصر حسب مفتاح معين
 * @example
 * const trips = [{status: 'active'}, {status: 'completed'}, {status: 'active'}]
 * groupBy(trips, 'status')
 * // { active: [{}, {}], completed: [{}] }
 */
export function groupBy<T, K extends keyof T>(
    array: T[],
    key: K
): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * حساب مجموع حقل رقمي
 * @example
 * const items = [{qty: 10}, {qty: 20}, {qty: 5}]
 * sumBy(items, 'qty') // 35
 */
export function sumBy<T>(array: T[], key: keyof T): number {
    return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

/**
 * حساب المتوسط لحقل رقمي
 * @example
 * const items = [{price: 10}, {price: 20}, {price: 30}]
 * avgBy(items, 'price') // 20
 */
export function avgBy<T>(array: T[], key: keyof T): number {
    if (array.length === 0) return 0;
    return sumBy(array, key) / array.length;
}

/**
 * فلترة المصفوفة حسب نص بحث
 * @example
 * const suppliers = [{name: 'Ahmed'}, {name: 'Ali'}, {name: 'Sara'}]
 * filterBySearch(suppliers, 'name', 'ah') // [{name: 'Ahmed'}]
 */
export function filterBySearch<T>(
    array: T[],
    keys: (keyof T)[],
    searchTerm: string
): T[] {
    if (!searchTerm.trim()) return array;

    const term = searchTerm.toLowerCase().trim();
    return array.filter(item =>
        keys.some(key => {
            const value = item[key];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(term);
            }
            return false;
        })
    );
}

/**
 * ترتيب المصفوفة حسب مفتاح
 * @example
 * const items = [{name: 'Banana'}, {name: 'Apple'}]
 * sortBy(items, 'name', 'asc') // [{name: 'Apple'}, {name: 'Banana'}]
 */
export function sortBy<T>(
    array: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return order === 'asc' ? comparison : -comparison;
    });
}

/**
 * تقسيم المصفوفة إلى صفحات
 * @example
 * const items = [1,2,3,4,5,6,7,8,9,10]
 * paginate(items, 3, 2) // [4,5,6]
 */
export function paginate<T>(
    array: T[],
    page: number,
    pageSize: number
): T[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
}

/**
 * حساب إجمالي الصفحات
 * @example
 * totalPages(100, 10) // 10
 */
export function totalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
}
