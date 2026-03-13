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
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-3 sm:p-5 shadow-card h-full"
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-[10px] sm:text-sm flex items-center gap-1.5 sm:gap-2">
                    <Ship className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" />
                    الشحنات
                </h3>
            </div>
            <div className="space-y-1.5 sm:space-y-2.5">
                {shipments.map(shipment => (
                    <div key={shipment.id} className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/40">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="font-bold text-[11px] sm:text-sm truncate mr-1">{shipment.shipment_number}</p>
                            <StatusBadge status={shipment.status} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                            <span className="truncate">{shipment.departure_port}</span>
                            <div className="flex-1 h-px bg-border relative">
                                <Ship className="w-2.5 h-2.5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded" />
                            </div>
                            <span className="truncate">{shipment.arrival_port}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

