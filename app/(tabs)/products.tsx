// Products Screen - China Trade Assistant Pro

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/stores/appStore';
import { Product } from '../../src/types/database';

function ProductCard({ product }: { product: Product }) {
    return (
        <TouchableOpacity style={styles.productCard}>
            <View style={styles.productHeader}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>{product.quantity} وحدة</Text>
            </View>
            {product.name_chinese ? (
                <Text style={styles.productChinese}>{product.name_chinese}</Text>
            ) : null}
            <View style={styles.priceRow}>
                <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>سعر الشراء</Text>
                    <Text style={styles.priceValue}>¥{product.purchase_price}</Text>
                </View>
                <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>سعر البيع</Text>
                    <Text style={[styles.priceValue, styles.salePrice]}>${product.sale_price}</Text>
                </View>
            </View>
            {product.category ? (
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{product.category}</Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
}

export default function ProductsScreen() {
    const products = useAppStore((state) => state.products);

    if (products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>لا توجد منتجات</Text>
                <Text style={styles.emptySubtitle}>
                    أضف منتجاتك الأولى
                </Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>➕ إضافة منتج</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabText}>➕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    list: {
        padding: 16,
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    productQuantity: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
    },
    productChinese: {
        fontSize: 14,
        color: '#ef4444',
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 24,
    },
    priceItem: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    salePrice: {
        color: '#10b981',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        marginTop: 12,
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#0284c7',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        textAlign: 'center',
    },
    addButton: {
        marginTop: 24,
        backgroundColor: '#1e40af',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1e40af',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#1e40af',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    fabText: {
        fontSize: 24,
        color: 'white',
    },
});
