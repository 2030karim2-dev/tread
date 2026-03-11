import { motion } from 'framer-motion';
import { Ship } from 'lucide-react';
import { StatusBadge } from '@/components/shared';

interface Shipment {
    id: string;
    shipment_number: string;
    status: string;
    departure_port: string;
    arrival_port: string;
    shipping_company: string;
    cartons_count: number;
}

interface ShipmentTrackingProps {
    shipments: Shipment[];
}

export function ShipmentTracking({ shipments }: ShipmentTrackingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-card rounded-2xl border border-border p-5 shadow-card"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm flex items-center gap-2">
                    <Ship className="w-4 h-4 text-info" />
                    تتبع الشحنات
                </h3>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {shipments.length} شحنة
                </span>
            </div>
            <div className="space-y-2.5">
                {shipments.map(shipment => (
                    <div key={shipment.id} className="p-3 rounded-xl bg-muted/40">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-sm">{shipment.shipment_number}</p>
                            <StatusBadge status={shipment.status} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">{shipment.departure_port}</span>
                            <div className="flex-1 h-px bg-border relative">
                                <Ship className="w-3 h-3 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded" />
                            </div>
                            <span className="font-medium">{shipment.arrival_port}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5">
                            {shipment.shipping_company} • {shipment.cartons_count} كرتون
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
