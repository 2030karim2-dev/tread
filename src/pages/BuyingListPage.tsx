import { useState, useMemo } from 'react';
import { Plus, ShoppingBag, Target, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader, EditableTable, EmptyState, SearchBar, StatusBadge } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { BuyingItem } from '@/store/slices/buyingListSlice';

const emptyBuyingItem: Omit<BuyingItem, 'id'> = {
  product_name: '',
  oem_number: '',
  target_quantity: 0,
  bought_quantity: 0,
  priority: 'medium',
  status: 'pending',
  notes: '',
  trip_id: 'all',
  customer_name: '',
};

export default function BuyingListPage() {
  const buyingList = useAppStore(s => s.buyingList);
  const addBuyingItem = useAppStore(s => s.addBuyingItem);
  const updateBuyingItem = useAppStore(s => s.updateBuyingItem);
  const deleteBuyingItem = useAppStore(s => s.deleteBuyingItem);
  const trips = useAppStore(s => s.trips);

  const [search, setSearch] = useState('');
  const [tripFilter, setTripFilter] = useState('all');

  const filteredItems = useMemo(() => {
    return buyingList.filter(item => {
      const matchesSearch = search === '' ||
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        item.oem_number.toLowerCase().includes(search.toLowerCase());
      const matchesTrip = tripFilter === 'all' || item.trip_id === tripFilter;
      return matchesSearch && matchesTrip;
    });
  }, [buyingList, search, tripFilter]);

  const stats = useMemo(() => {
    const total = buyingList.length;
    const bought = buyingList.filter(i => i.status === 'bought').length;
    const highPriority = buyingList.filter(i => i.priority === 'high' && i.status !== 'bought').length;
    return { total, bought, highPriority };
  }, [buyingList]);

  const columns: ColumnDef<BuyingItem>[] = useMemo(() => [
    { key: 'product_name', header: 'اسم المنتج', minWidth: '160px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '140px', mono: true },
    { 
        key: 'customer_name', header: 'العميل', minWidth: '120px',
        render: (row) => <span className="text-[11px] font-bold text-primary">{row.customer_name || 'خزين عام'}</span>
    },
    { 
        key: 'priority', header: 'الأولوية', minWidth: '100px', align: 'center',
        render: (row) => (
            <div className={`px-2 py-1 rounded-full text-[10px] font-bold text-center ${
                row.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 
                row.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 
                'bg-blue-500/10 text-blue-500'
            }`}>
                {row.priority === 'high' ? 'عالية 🔥' : row.priority === 'medium' ? 'متوسطة' : 'عادية'}
            </div>
        )
    },
    { key: 'target_quantity', header: 'الكمية المطلوبة', minWidth: '100px', type: 'number', align: 'center' },
    { key: 'bought_quantity', header: 'الكمية المشتراة', minWidth: '100px', type: 'number', align: 'center' },
    {
      key: 'status', header: 'الحالة', minWidth: '120px', align: 'center',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'progress' as any, header: 'الإنجاز', minWidth: '120px', editable: false,
      render: (row) => {
        const progress = row.target_quantity > 0 ? (row.bought_quantity / row.target_quantity) * 100 : 0;
        return (
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
              style={{ width: `${Math.min(progress, 100)}%` }} 
            />
          </div>
        );
      }
    },
    { key: 'notes', header: 'ملاحظات', minWidth: '150px' },
  ], []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="قائمة مشتريات الرحلة" 
        subtitle="تتبع المنتجات التي تحتاج لشرائها في الصين بدقة عالية"
      >
        <Button 
          onClick={() => addBuyingItem(emptyBuyingItem)} 
          className="gradient-primary text-primary-foreground gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" /> إضافة صنف مطلوب
        </Button>
      </PageHeader>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatItem icon={Target} label="إجمالي المطلوب" value={stats.total} color="text-primary" />
        <StatItem icon={CheckCircle2} label="تم إنجازه" value={`${stats.bought} صنف`} color="text-emerald-500" />
        <StatItem icon={AlertTriangle} label="أولوية عالية متبقية" value={stats.highPriority} color="text-rose-500" />
      </div>

      <SearchBar
        placeholder="ابحث في قائمة المشتريات..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'trip',
            label: 'تصفية حسب الرحلة',
            options: [
                { value: 'all', label: 'كل الرحلات' },
                ...trips.map(t => ({ value: t.id, label: t.name }))
            ],
            value: tripFilter,
            onChange: setTripFilter,
          },
        ]}
      />

      {filteredItems.length === 0 ? (
        <EmptyState 
            icon={ShoppingBag}
            message={search || tripFilter !== 'all' ? 'لا توجد نتائج' : 'قائمة المشتريات فارغة. خطط لرحلتك القادمة هنا!'} 
        />
      ) : (
        <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
            <EditableTable
                data={filteredItems}
                columns={columns}
                onCellChange={(id, field, value) => updateBuyingItem(id, { [field]: value })}
                onDeleteRow={deleteBuyingItem}
            />
        </div>
      )}

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>نصيحة المتسوق:</strong> استخدم هذه القائمة أثناء تجولك في أسواق قوانغتشو. يمكنك تحويل الأصناف التي تم شراؤها إلى مخزون فعلي أو فواتير شراء بضغطة زر (قريباً).
          </p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
    return (
        <div className="p-4 bg-card rounded-2xl border border-border/50 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </div>
    );
}
